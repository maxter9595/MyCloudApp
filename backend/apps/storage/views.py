import os
import uuid
from datetime import timedelta

from apps.accounts.models import CustomUser
from django.core.cache import cache
from django.core.exceptions import PermissionDenied
from django.db.models import Prefetch
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from mycloud.settings.base import CACHE_TTL
from rest_framework import generics, permissions, serializers, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from .models import UserFile
from .renderers.binary_file import BinaryFileRenderer
from .serializers import FileSerializer, FileShareSerializer


class FileListView(generics.ListCreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get_cache_key(self):
        user = self.request.user
        user_id = user.id
        if user.is_superuser and 'user_id' in self.request.query_params:
            user_id = self.request.query_params['user_id']
        return f'user_files_{user_id}'

    def get_queryset(self):
        cache_key = self.get_cache_key()
        queryset = cache.get(cache_key)
        
        if queryset is None:
            user = self.request.user

            if user.is_superuser and 'user_id' in self.request.query_params:
                target_user = get_object_or_404(
                    CustomUser,
                    id=self.request.query_params['user_id']
                )
                queryset = UserFile.objects.filter(user=target_user)
            else:
                queryset = UserFile.objects.filter(user=user)

            queryset = queryset.select_related('user').only(
                'id',
                'original_name',
                'size',
                'upload_date',
                'last_download',
                'comment',
                'shared_link',
                'shared_expiry',
                'user__username'
            )
            
            cache.set(cache_key, queryset, timeout=CACHE_TTL)

        return queryset

    # def perform_create(self, serializer):
    #     """
    #     Customize the creation of a new UserFile object and invalidate cache
    #     """
    #     file_obj = self.request.FILES.get('file')
    #     if not file_obj:
    #         raise ValueError("No file was uploaded")

    #     user = self.request.user
    #     if not user.has_storage_space(file_obj.size):
    #         raise serializers.ValidationError({
    #             'error': "You have exceeded the maximum storage limit. "
    #             "Please contact the administrator at admin@mail.ru "
    #             "to increase your storage quota"
    #         })

    #     # Create the file instance with all required fields
    #     instance = UserFile(
    #         user=user,
    #         original_name=file_obj.name,
    #         size=file_obj.size,
    #         file=file_obj,
    #         comment=self.request.data.get('comment', '')
    #     )
    #     instance.save()
        
    #     # Invalidate cache
    #     cache.delete(self.get_cache_key())
    #     return instance

    def create(self, request, *args, **kwargs):
        file_obj = self.request.FILES.get('file')
        if not file_obj:
            raise ValueError("No file was uploaded")

        user = request.user
        if not user.has_storage_space(file_obj.size):
            raise serializers.ValidationError({
                'error': "You have exceeded the maximum storage limit. "
                        "Please contact the administrator at admin@mail.ru "
                        "to increase your storage quota"
            })

        instance = UserFile.objects.create(
            user=user,
            original_name=file_obj.name,
            size=file_obj.size,
            file=file_obj,
            comment=request.data.get('comment', '')
        )

        cache.delete(self.get_cache_key())

        serializer = self.get_serializer(instance)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    @action(detail=False, methods=['post'])
    def clear_cache(self, request):
        """
        Clear cache for current user's files
        """
        cache.delete(self.get_cache_key())
        return Response({'status': 'cache cleared'}, status=status.HTTP_200_OK)

class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve a queryset of UserFile objects with optimized queries
        """
        user = self.request.user

        if user.is_superuser and 'user_id' in self.request.query_params:
            target_user = get_object_or_404(
                CustomUser,
                id=self.request.query_params['user_id']
            )
            queryset = UserFile.objects.filter(user=target_user)
        else:
            queryset = UserFile.objects.filter(user=user)

        return queryset.select_related('user').only(
            'id',
            'original_name',
            'size',
            'upload_date',
            'last_download',
            'comment',
            'shared_link',
            'shared_expiry',
            'user__username',
            'file'
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        # instance.last_download = None
        # instance.save()

        expiry_days = self.request.data.get('expiry_days')

        if expiry_days:
            instance.shared_expiry = timezone.now() + timedelta(days=int(expiry_days))
            instance.save(update_fields=['shared_expiry'])

        # Инвалидируем кеш списка файлов
        cache_key = f'user_files_{instance.user.id}'
        cache.delete(cache_key)

    def perform_destroy(self, instance):
        user_id = instance.user.id
        instance.delete()
        
        # Инвалидируем кеш списка файлов
        cache_key = f'user_files_{user_id}'
        cache.delete(cache_key)


class FileDownloadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [BinaryFileRenderer]

    def get(self, request, pk):
        try:
            user_file = self.get_object(pk)
            if not user_file.file:
                raise Http404("File not found")

            user_file.last_download = timezone.now()
            user_file.save(update_fields=['last_download'])

            file_path = user_file.file.path
            if not os.path.exists(file_path):
                raise Http404("File not found on disk")

            response = FileResponse(
                open(file_path, 'rb'),
                content_type='application/octet-stream',
                as_attachment=True,
                filename=user_file.original_name
            )
            response['Content-Disposition'] = f'attachment; filename="{user_file.original_name}"'
            return response
        except Exception as e:
            print(f"Error downloading file: {str(e)}")
            return Response(
                {"detail": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_object(self, pk):
        """
        Returns the UserFile object with the given primary key.
        """
        file = get_object_or_404(UserFile, pk=pk)

        is_superuser = self.request.user.is_superuser
        if not is_superuser and file.user != self.request.user:
            raise PermissionDenied(
                "You don't have the rights to download this file"
            )

        return file


class SharedFileDownloadView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, shared_link):
        """
        Handle GET requests to download a file from a shared link.
        """
        try:
            user_file = get_object_or_404(
                UserFile,
                shared_link=shared_link
            )

            if user_file.is_shared_link_expired():
                return Response(
                    {"detail": "Срок действия ссылки истек"},
                    status=status.HTTP_410_GONE
                )

            user_file.last_download = timezone.now()
            user_file.save()

            if not user_file.file:
                raise Http404("File not found on server")

            response = FileResponse(
                user_file.file,
                as_attachment=True,
                filename=user_file.original_name
            )

            return response

        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FileShareView(generics.UpdateAPIView):
    serializer_class = FileShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Оптимизированный запрос с select_related для пользователя
        """
        user = self.request.user
        return UserFile.objects.filter(user=user).select_related('user')

    def patch(self, request, *args, **kwargs):
        """
        Creates or updates a shared link for a file
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        # serializer.save(shared_link=uuid.uuid4())

        # if 'expiry_days' not in request.data:
        #     instance.shared_expiry = None
        #     instance.save()
        
        # instance.shared_link = uuid.uuid4()
        # instance.save()
        
        # Инвалидируем кеш списка файлов
        cache_key = f'user_files_{instance.user.id}'
        cache.delete(cache_key)
        
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        """
        Deletes the shared link from the file
        """
        instance = self.get_object()
        user_id = instance.user.id
        
        instance.shared_link = None
        instance.shared_expiry = None
        instance.save()
        
        # Инвалидируем кеш списка файлов
        cache_key = f'user_files_{user_id}'
        cache.delete(cache_key)
        
        return Response(status=status.HTTP_204_NO_CONTENT)

from django.conf import settings
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout

from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes

from .models import CustomUser
from .serializers import (
    AdminCreateSerializer,
    LoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
)
from apps.accounts.throttling import (
    LoginThrottle,
    RegisterThrottle
)


class RegisterView(generics.CreateAPIView):
    throttle_classes = [RegisterThrottle]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                'user': UserSerializer(user).data,
                'token': token.key
            }, 
            status=status.HTTP_201_CREATED
        )


class LoginView(GenericAPIView):
    throttle_classes = [LoginThrottle]
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(
            request=request,
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {
                    "error": "You are deactivated.\
                    Please contact admin (admin@mail.ru)",
                    "code": "account_deactivated"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.pk,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active
            }
        })


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer


class AdminCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = AdminCreateSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save(
            is_superuser=True,
            is_staff=True,
            max_storage=settings.MAX_ADMIN_BYTES
        )
        user.set_password(serializer.validated_data['password'])
        user.save()


@api_view(['GET'])
def get_csrf_token(request):
    return Response({
        'csrfToken': get_token(request)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    storage_usage = user.get_storage_usage()
    storage_usage_percent = (storage_usage / user.max_storage) * 100\
        if user.max_storage else 0

    return Response({
        'id': user.pk,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'is_active': user.is_active,
        'storage_usage': user.get_storage_usage(),
        'max_storage': user.max_storage,
        'storage_usage_percent': storage_usage_percent
    })


@api_view(['GET'])
def check_username(request):
    username = request.GET.get('username', '')
    exists = CustomUser.objects.filter(username__iexact=username).exists()
    return JsonResponse({'available': not exists})


@api_view(['GET'])
def check_email(request):
    email = request.GET.get('email', '')
    exists = CustomUser.objects.filter(email__iexact=email).exists()
    return JsonResponse({'available': not exists})

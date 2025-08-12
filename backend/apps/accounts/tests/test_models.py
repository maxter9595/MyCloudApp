import os

from django.db import connection
from django.core.cache import cache
from django.test import TransactionTestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.accounts.models import CustomUser
from apps.storage.models import UserFile


class CustomUserModelTest(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        cache.clear()
        UserFile.objects.all().delete()

        if connection.vendor == 'postgresql':
            with connection.cursor() as cursor:
                cursor.execute(
                    "TRUNCATE storage_userfile, accounts_customuser RESTART IDENTITY CASCADE;"
                )

        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            full_name='Test User',
            password='testpass123',
            max_storage=100 * 1024 * 1024
        )

    def test_storage_usage_calculation(self):
        test_content = b'This is a test file content'
        test_file = SimpleUploadedFile(
            'test_file.txt',
            test_content,
            content_type='text/plain'
        )

        user_file = UserFile(
            user=self.user,
            original_name='test_file.txt',
            file=test_file,
            size=len(test_content)
        )
        user_file.save()

        usage = self.user.get_storage_usage()
        self.assertEqual(usage, len(test_content))

        cached_usage = cache.get(f'user_{self.user.id}_storage_usage')
        self.assertEqual(cached_usage, usage)

    def test_storage_usage_percent(self):
        cache.delete(f'user_{self.user.id}_storage_usage')
        
        test_size = 50 * 1024 * 1024
        test_file = SimpleUploadedFile('test.txt', b'x' * test_size)

        UserFile.objects.create(
            user=self.user,
            file=test_file,
            size=test_size
        )
        self.user.max_storage = 100 * 1024 * 1024
        self.user.save()
        
        percent = self.user.get_storage_usage_percent()
        self.assertEqual(percent, 50.0)

    def test_has_storage_space(self):
        cache.delete(f'user_{self.user.id}_storage_usage')
        UserFile.objects.filter(user=self.user).delete()

        self.user.max_storage = 100 * 1024 * 1024
        self.user.save()

        test_size = 50 * 1024 * 1024
        test_file = SimpleUploadedFile(
            'test_file.txt',
            b'x' * test_size,
            content_type='text/plain'
        )
        UserFile.objects.create(
            user=self.user,
            file=test_file,
            size=test_size
        )

        self.assertTrue(
            self.user.has_storage_space(50 * 1024 * 1024),
            "Должно быть место для 50MB"
        )
        self.assertFalse(
            self.user.has_storage_space(60 * 1024 * 1024),
            "Не должно быть места для 60MB"
        )

    def test_storage_path_auto_generation(self):
        new_user = CustomUser.objects.create_user(
            username='newuser',
            email='new@example.com',
            full_name='New User',
            password='testpass123'
        )
        self.assertEqual(
            new_user.storage_path,
            os.path.join('user_storage', f'user_{new_user.id}')
        )

    def test_admin_user_creation(self):
        admin = CustomUser.objects.create_superuser(
            username='adminuser',
            email='admin@example.com',
            full_name='Admin',
            password='adminpass'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

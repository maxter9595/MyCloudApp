from apps.accounts.models import CustomUser
from apps.storage.models import UserFile
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase


class StorageQuotaTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = CustomUser.objects.create_user(
        username='quotauser',
        email='quota@example.com',
        full_name='Quota User',
        password='testpass123',
        max_storage=10 * 1024 * 1024 # 10MB
    )

    def test_quota_check(self):
        # Создаем файл размером 5MB
        file_5mb = SimpleUploadedFile(
            '5mb.txt',
            b'x' * 5 * 1024 * 1024,
            content_type='text/plain'
        )
        
        # Создаем файл в базе с реальным файлом
        user_file = UserFile(
            user=self.user,
            file=file_5mb,
            size=file_5mb.size
        )
        user_file.save()
        
        # Инвалидируем кеш, чтобы пересчитать использование
        cache.delete(f'user_{self.user.id}_storage_usage')

        # Проверяем, что теперь нельзя загрузить еще 6MB
        file_6mb = SimpleUploadedFile(
            '6mb.txt',
            b'x' * 6 * 1024 * 1024,
            content_type='text/plain'
        )
        can_store_6mb = self.user.has_storage_space(file_6mb.size)
        self.assertFalse(can_store_6mb)

        # Но можно загрузить 4.9MB
        file_4_9mb = SimpleUploadedFile(
            '4.9mb.txt',
            b'x' * int(4.9 * 1024 * 1024),
            content_type='text/plain'
        )
        can_store_4_9mb = self.user.has_storage_space(file_4_9mb.size)
        self.assertTrue(can_store_4_9mb)

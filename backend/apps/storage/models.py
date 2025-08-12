import os
import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone

from apps.accounts.models import CustomUser


def user_directory_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    return os.path.join(
        f'user_{instance.user.id}_storage',
        filename
    )


class UserFile(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE
    )
    original_name = models.CharField(
        max_length=255
    )
    file = models.FileField(
        upload_to=user_directory_path
    )
    size = models.BigIntegerField()
    upload_date = models.DateTimeField(
        auto_now_add=True
    )
    last_download = models.DateTimeField(
        null=True,
        blank=True
    )
    comment = models.TextField(
        blank=True
    )
    shared_link = models.UUIDField(
        default=uuid.uuid4,
        unique=True
    )
    shared_expiry = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Link expiration date and time"
    )

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if is_new:
            self.original_name = os.path.basename(
                self.file.name
            )
            self.size = self.file.size
            if self.shared_expiry is None:
                self.shared_expiry = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.file:
            try:
                storage = self.file.storage
                path = self.file.path
                storage.delete(path)
            except Exception as e:
                print(f"Error deleting file: {e}")
        super().delete(*args, **kwargs)

    def is_shared_link_expired(self):
        if not self.shared_expiry:
            return False
        return timezone.now() > self.shared_expiry

    def __str__(self):
        return f"{self.user.username}: {self.original_name}"

    class Meta:
        verbose_name = 'File'
        verbose_name_plural = 'Files'

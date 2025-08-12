import os
import uuid
from datetime import timedelta

from apps.accounts.models import CustomUser
from django.db import models
from django.utils import timezone


def user_directory_path(instance, filename):
    """
    Create a directory path to store a user's files.
    The directory name is of the form user_<user_id>_storage
    and the file name is an uuid with the same extension as
    the original file name.

    :param instance: The UserFile instance to generate a path for
    :param filename: The name of the file to be stored
    :return: A string representing the path to store the file
    """
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

    # def save(self, *args, **kwargs):
    #     """
    #     Save the UserFile model to the database.
    #     """
    #     if not self.pk:  # Only for new files
    #         # Set original name and size from the file
    #         self.original_name = os.path.basename(self.file.name)
    #         self.size = self.file.size
            
    #         # First save to get the ID
    #         super().save(*args, **kwargs)
            
    #         # Update the file path with the user ID
    #         old_path = self.file.path
    #         self.file.name = user_directory_path(self, self.original_name)
            
    #         # Create directory if it doesn't exist
    #         os.makedirs(os.path.dirname(self.file.path), exist_ok=True)
            
    #         # Move the file to the new location
    #         if os.path.exists(old_path):
    #             os.rename(old_path, self.file.path)
        
    #     super().save(*args, **kwargs)

    # def save(self, *args, **kwargs):
    #     is_new = self.pk is None
    #     if is_new:
    #         self.original_name = os.path.basename(self.file.name)
    #         self.size = self.file.size

    #     super().save(*args, **kwargs)

    #     if is_new:
    #         old_path = self.file.path
    #         new_file_name = self.file.field.upload_to(self, self.original_name)
    #         self.file.name = new_file_name
    #         os.makedirs(os.path.dirname(self.file.path), exist_ok=True)
    #         if os.path.exists(old_path):
    #             os.rename(old_path, self.file.path)
    #         super().save(update_fields=['file'])


    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if is_new:
            self.original_name = os.path.basename(self.file.name)
            self.size = self.file.size
            # Задаём дефолтный срок действия ссылки, например 7 дней от загрузки
            if self.shared_expiry is None:
                self.shared_expiry = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Delete the file from storage 
        and then delete the model instance.
        """
        if self.file:
            try:
                storage = self.file.storage
                path = self.file.path
                storage.delete(path)
            except Exception as e:
                print(f"Error deleting file: {e}")
        super().delete(*args, **kwargs)

    def is_shared_link_expired(self):
        """
        Check if the shared link has expired.
        """
        if not self.shared_expiry:
            return False
        return timezone.now() > self.shared_expiry

    def __str__(self):
        """
        Return a string representation of the UserFile.
        """
        return f"{self.user.username}: {self.original_name}"

    class Meta:
        verbose_name = 'File'
        verbose_name_plural = 'Files'

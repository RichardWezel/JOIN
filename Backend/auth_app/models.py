from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    """User that logs in with email instead of username."""

    username = None
    email = models.EmailField(unique=True)
    color = models.CharField(max_length=20, default='#FF7A00')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

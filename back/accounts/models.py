from django.contrib.auth.models import AbstractUser
from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    phone_number = models.CharField(max_length=11, unique=True)


class Address(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Addresses")
    title = models.CharField(max_length=50)
    city = models.CharField(max_length=70)
    province = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10)
    address = models.TextField()
    is_default = models.BooleanField(default=False)



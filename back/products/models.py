from django.db import models
from accounts.models import BaseModel, User

class Category(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children")
    icon = models.CharField(max_length=10, blank=True)


class Brand(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to="brands/", blank=True)


class Product(BaseModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name="products")
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField(null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)


    @property
    def is_stock(self):
        return self.stock > 0


class ProductImage(BaseModel):
    product = models.ForeignKey(Product, on_delete= models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    is_main = models.BooleanField(default=False)


class ProductSpec(BaseModel):
    product = models.ForeignKey(Product, on_delete= models.CASCADE, related_name="specs")
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=200)

class Review(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)


    class Meta:
        unique_together = ("product", "user")
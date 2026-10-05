from django.contrib import admin
from .models import Category, Brand, Product, ProductImage, ProductSpec, Review

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductSpecInline(admin.TabularInline):
    model = ProductSpec
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "parent"]
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "brand", "price", "stock", "is_active"]
    list_filter = ["category", "brand", "is_active"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductSpecInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "user", "rating", "is_approved", "created_at"]
    list_filter = ["is_approved", "rating"]
    actions = ["approve_reviews"]

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = "تایید نظرات انتخاب‌شده"
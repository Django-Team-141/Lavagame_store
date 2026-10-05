from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ["username", "email", "phone_number", "is_staff", "date_joined"]
    search_fields = ["username", "email", "phone_number"]
    fieldsets = UserAdmin.fieldsets + (("اطلاعات تکمیلی", {"fields": ("phone_number",)}),)

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["user", "title", "city", "is_default"]
    list_filter = ["city", "is_default"]
    search_fields = ["user__username", "city"]

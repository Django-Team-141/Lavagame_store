from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["order", "amount", "gateway", "is_successful", "paid_at"]
    list_filter = ["gateway", "is_successful"]
    readonly_fields = ["transaction_id"]
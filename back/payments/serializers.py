from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "amount", "gateway", "transaction_id", "is_successful", "paid_at"]
        read_only_fields = ["is_successful", "paid_at", "transaction_id"]
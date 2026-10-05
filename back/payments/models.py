from django.db import models
from accounts.models import BaseModel
from orders.models import Order


class Payment(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.PositiveIntegerField()
    gateway = models.CharField(max_length=30, default="zarinpal")
    transaction_id = models.CharField(max_length=100, blank=True)
    is_successful = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
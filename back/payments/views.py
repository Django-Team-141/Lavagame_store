from django.utils import timezone
from rest_framework import views, permissions, status
from rest_framework.response import Response
from orders.models import Order
from .models import Payment

class PaymentInitiateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        try:
            order = Order.objects.get(id=order_id, user=request.user, status="pending")
        except Order.DoesNotExist:
            return Response({"detail": "سفارش پیدا نشد یا قبلاً پرداخت شده"}, status=404)

        payment, _ = Payment.objects.get_or_create(
            order=order, defaults={"amount": order.total_price, "gateway": "zarinpal"}
        )

        # اینجا باید API درگاه پرداخت رو صدا بزنی و لینک پرداخت بگیری
        # payment_url = zarinpal_request(amount=payment.amount, ...)
        # payment.transaction_id = authority
        # payment.save()

        return Response({"detail": "آماده اتصال به درگاه", "payment_id": payment.id})


class PaymentVerifyView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("payment_id")
        try:
            payment = Payment.objects.get(id=payment_id, order__user=request.user)
        except Payment.DoesNotExist:
            return Response({"detail": "پرداخت پیدا نشد"}, status=404)

        # اینجا باید نتیجه رو از درگاه واقعی چک کنی
        # is_ok = zarinpal_verify(authority=payment.transaction_id, amount=payment.amount)
        is_ok = True  # placeholder

        if is_ok:
            payment.is_successful = True
            payment.paid_at = timezone.now()
            payment.save()
            payment.order.status = "paid"
            payment.order.save()
            return Response({"detail": "پرداخت موفق"})

        return Response({"detail": "پرداخت ناموفق"}, status=400)
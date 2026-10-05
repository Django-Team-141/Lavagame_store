from django.db import transaction
from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from accounts.models import Address
from cart.utils import get_or_create_cart
from .models import Order, OrderItem, Coupon
from .serializers import OrderSerializer, CheckoutSerializer


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = get_or_create_cart(request.user)
        items = list(cart.items.select_related("product"))

        if not items:
            return Response({"detail": "سبد خرید خالیه"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            address = Address.objects.get(id=data["address_id"], user=request.user)
        except Address.DoesNotExist:
            return Response({"detail": "آدرس پیدا نشد"}, status=status.HTTP_404_NOT_FOUND)

        for item in items:
            if item.quantity > item.product.stock:
                return Response(
                    {"detail": f"موجودی «{item.product.name}» کافی نیست"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        coupon = None
        coupon_code = data.get("coupon_code")
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                if coupon.used_count >= (coupon.max_uses or float("inf")):
                    return Response({"detail": "این کد تخفیف تمام شده"}, status=400)
            except Coupon.DoesNotExist:
                return Response({"detail": "کد تخفیف نامعتبره"}, status=400)

        with transaction.atomic():
            total_price = sum(item.product.price * item.quantity for item in items)
            if coupon:
                if coupon.discount_percent:
                    total_price -= total_price * coupon.discount_percent // 100
                elif coupon.discount_amount:
                    total_price -= coupon.discount_amount
                coupon.used_count += 1
                coupon.save()

            order = Order.objects.create(
                user=request.user,
                address=address,
                coupon=coupon,
                total_price=total_price,
                status="pending",
            )

            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price_at_purchase=item.product.price,
                )
                item.product.stock -= item.quantity
                item.product.save()

            cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
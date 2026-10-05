from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import CartItem
from .serializers import CartSerializer
from .utils import get_or_create_cart

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]   # قبلاً AllowAny بود

    def get(self, request):
        cart = get_or_create_cart(request.user)
        return Response(CartSerializer(cart).data)

class CartItemAddView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_or_create_cart(request.user)
        product = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        item, created = CartItem.objects.get_or_create(cart=cart, product_id=product)
        item.quantity = item.quantity + quantity if not created else quantity
        item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

class CartItemUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        cart = get_or_create_cart(request.user)
        try:
            item = cart.items.get(id=item_id)
        except CartItem.DoesNotExist:
            return Response({"detail": "آیتم پیدا نشد"}, status=404)

        quantity = int(request.data.get("quantity", item.quantity))
        if quantity < 1:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request.user)
        cart.items.filter(id=item_id).delete()
        return Response(CartSerializer(cart).data)
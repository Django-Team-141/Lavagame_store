from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True), source="product", write_only=True
    )
    product_name = serializers.CharField(source="product.name", read_only=True)
    price = serializers.IntegerField(source="product.price", read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product_id", "product_name", "price", "quantity", "subtotal"]

    def get_subtotal(self, obj):
        return obj.product.price * obj.quantity

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("تعداد باید حداقل ۱ باشه")
        return value

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total_price"]

    def get_total_price(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())
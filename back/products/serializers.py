from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductSpec, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent", "icon"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "slug", "logo"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]


class ProductSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpec
        fields = ["key", "value"]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "user", "rating", "comment", "created_at"]
        read_only_fields = ["is_approved"]


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    brand = serializers.SlugRelatedField(slug_field="name", read_only=True)
    main_image = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "brand",
            "price", "old_price", "main_image", "rating", "review_count",
        ]

    def get_main_image(self, obj):
        img = obj.images.filter(is_main=True).first() or obj.images.first()
        return img.image.url if img else None

    def get_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        return round(sum(r.rating for r in reviews) / reviews.count(), 1) if reviews.exists() else None

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ["description", "stock", "images", "specs", "reviews"]

    def get_reviews(self, obj):
        qs = obj.reviews.filter(is_approved=True).order_by("-created_at")
        return ReviewSerializer(qs, many=True).data
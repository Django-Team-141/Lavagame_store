from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import CategoryViewSet, BrandViewSet, ProductViewSet, ReviewViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("brands", BrandViewSet)
router.register("products", ProductViewSet)

products_router = routers.NestedDefaultRouter(router, "products", lookup="product")
products_router.register("reviews", ReviewViewSet, basename="product-reviews")

urlpatterns = router.urls + products_router.urls
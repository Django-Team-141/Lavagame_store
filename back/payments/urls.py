from django.urls import path
from .views import PaymentInitiateView, PaymentVerifyView

urlpatterns = [
    path("initiate/", PaymentInitiateView.as_view()),
    path("verify/", PaymentVerifyView.as_view()),
]
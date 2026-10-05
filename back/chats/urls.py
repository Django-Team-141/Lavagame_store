from django.urls import path

from .views import DeepSeekChatView


urlpatterns = [
    path("", DeepSeekChatView.as_view(), name="deepseek-chat"),
]
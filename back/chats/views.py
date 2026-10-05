import time
import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


SYSTEM_PROMPT = """
تو دستیار هوشمند فروشگاه لاوا گیم هستی.

وظایف تو:
- کمک به کاربران درباره محصولات و خدمات لاوا گیم
- راهنمایی درباره خرید
- راهنمایی درباره سبد خرید و سفارش
- توضیح کلی درباره دسته‌بندی‌های محصولات
- پاسخ کوتاه، دوستانه و فارسی

قوانین:
- اگر اطلاعاتی درباره محصول یا سفارش نداری، حدس نزن.
- اطلاعات ساختگی درباره قیمت، موجودی یا سفارش ایجاد نکن.
- درباره موضوعات نامرتبط با لاوا گیم پاسخ طولانی نده.
- پاسخ‌ها را واضح و مختصر نگه دار.
"""


def get_client_identifier(request):
    """
    کاربر لاگین‌شده:
        user ID

    مهمان:
        IP
    """

    if request.user and request.user.is_authenticated:
        return f"user:{request.user.id}"

    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR", "unknown")

    return f"ip:{ip}"


class DeepSeekChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # ---------------------------------
        # 1. دریافت پیام
        # ---------------------------------

        messages = request.data.get("messages", [])

        if not isinstance(messages, list):
            return Response(
                {"error": "فرمت messages صحیح نیست."},
                status=400,
            )

        if not messages:
            return Response(
                {"error": "پیامی ارسال نشده است."},
                status=400,
            )

        # ---------------------------------
        # 2. گرفتن آخرین پیام کاربر
        # ---------------------------------

        user_messages = [
            message
            for message in messages
            if message.get("role") == "user"
        ]

        if not user_messages:
            return Response(
                {"error": "پیام کاربر پیدا نشد."},
                status=400,
            )

        latest_message = user_messages[-1].get("content", "")

        if not isinstance(latest_message, str):
            return Response(
                {"error": "متن پیام صحیح نیست."},
                status=400,
            )

        latest_message = latest_message.strip()

        # ---------------------------------
        # 3. محدودیت طول پیام
        # ---------------------------------

        max_length = settings.DEEPSEEK_CHAT_MAX_MESSAGE_LENGTH

        if len(latest_message) > max_length:
            return Response(
                {
                    "error": f"پیام شما نمی‌تواند بیشتر از {max_length} کاراکتر باشد."
                },
                status=400,
            )

        if not latest_message:
            return Response(
                {"error": "پیام خالی است."},
                status=400,
            )

        # ---------------------------------
        # 4. شناسایی کاربر
        # ---------------------------------

        identifier = get_client_identifier(request)

        # ---------------------------------
        # 5. محدودیت روزانه
        # ---------------------------------

        daily_key = f"deepseek_daily:{identifier}"

        daily_count = cache.get(daily_key, 0)

        daily_limit = settings.DEEPSEEK_CHAT_DAILY_LIMIT

        if daily_count >= daily_limit:
            return Response(
                {
                    "error": (
                        "سقف روزانه استفاده از دستیار هوشمند "
                        "شما به پایان رسیده است. "
                        "فردا دوباره امتحان کنید."
                    ),
                    "code": "daily_limit",
                },
                status=429,
            )

        # ---------------------------------
        # 6. محدودیت زمانی بین درخواست‌ها
        # ---------------------------------

        cooldown_key = f"deepseek_cooldown:{identifier}"

        last_request = cache.get(cooldown_key)

        if last_request:

            elapsed = time.time() - last_request

            cooldown = settings.DEEPSEEK_CHAT_COOLDOWN

            if elapsed < cooldown:

                remaining = max(
                    1,
                    int(cooldown - elapsed),
                )

                return Response(
                    {
                        "error": (
                            f"لطفاً {remaining} ثانیه صبر کنید."
                        ),
                        "code": "cooldown",
                        "retry_after": remaining,
                    },
                    status=429,
                )

        # ---------------------------------
        # 7. API Key
        # ---------------------------------

        api_key = settings.DEEPSEEK_API_KEY

        if not api_key:
            return Response(
                {
                    "error": "DeepSeek API Key تنظیم نشده است."
                },
                status=500,
            )

        # ---------------------------------
        # 8. محدود کردن تاریخچه
        # ---------------------------------

        # فقط 10 پیام آخر کاربر/دستیار
        conversation = messages[-10:]

        clean_messages = []

        for message in conversation:

            role = message.get("role")
            content = message.get("content")

            if role not in ["user", "assistant"]:
                continue

            if not isinstance(content, str):
                continue

            content = content.strip()

            if not content:
                continue

            clean_messages.append(
                {
                    "role": role,
                    "content": content,
                }
            )

        # ---------------------------------
        # 9. اضافه کردن System Prompt
        # ---------------------------------

        deepseek_messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            }
        ]

        deepseek_messages.extend(clean_messages)

        # ---------------------------------
        # 10. درخواست به DeepSeek
        # ---------------------------------

        payload = {
            "model": "deepseek-chat",
            "messages": deepseek_messages,
            "stream": False,
            "temperature": 0.7,
            "max_tokens": settings.DEEPSEEK_CHAT_MAX_OUTPUT_TOKENS,
        }

        try:

            response = requests.post(
                "https://api.deepseek.com/chats/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=60,
            )

        except requests.RequestException:

            return Response(
                {
                    "error": (
                        "ارتباط با سرویس هوش مصنوعی برقرار نشد."
                    )
                },
                status=502,
            )

        # ---------------------------------
        # 11. پردازش پاسخ DeepSeek
        # ---------------------------------

        try:
            response_data = response.json()
        except ValueError:

            return Response(
                {
                    "error": "پاسخ نامعتبر از DeepSeek دریافت شد."
                },
                status=502,
            )

        if not response.ok:

            return Response(
                {
                    "error": "درخواست به DeepSeek ناموفق بود.",
                    "details": response_data.get("error"),
                },
                status=response.status_code,
            )

        try:

            answer = response_data["choices"][0]["message"]["content"]

        except (KeyError, IndexError, TypeError):

            return Response(
                {
                    "error": "ساختار پاسخ DeepSeek نامعتبر است."
                },
                status=502,
            )

        # ---------------------------------
        # 12. ثبت مصرف
        # ---------------------------------

        cache.set(
            cooldown_key,
            time.time(),
            timeout=settings.DEEPSEEK_CHAT_COOLDOWN,
        )

        cache.set(
            daily_key,
            daily_count + 1,
            timeout=60 * 60 * 24,
        )

        # ---------------------------------
        # 13. ارسال پاسخ به React
        # ---------------------------------

        return Response(
            {
                "answer": answer,
                "remaining_today": max(
                    0,
                    daily_limit - (daily_count + 1),
                ),
            }
        )
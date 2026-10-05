from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files import File
from pathlib import Path
from products.models import Category, Brand, Product, ProductSpec, ProductImage

CATEGORIES = [
    ("laptop","لپ‌تاپ","💻"),
    ("graphics-card","کارت گرافیک","🎮"),
    ("hard-drive","هارد و حافظه","💾"),
    ("monitor","مانیتور","🖥️"),
    ("keyboard","کیبورد","⌨️"),
    ("mouse","ماوس","🖱️"),
    ("headphone","هدفون","🎧"),
    ("hub","هاب و رم‌ریدر","🔌"),
    ("gaming-case","کیس گیمینگ","🧊"),
]
BRANDS = ["Asus","MSI","Gigabyte","Logitech","Razer","Kingston","AOC","HyperX","DeepCool","Corsair"]

NAMES = {
 "laptop":["لپ‌تاپ گیمینگ آذرخش 15","لپ‌تاپ گیمینگ نوا 16","لپ‌تاپ گیمینگ وُلت 15","لپ‌تاپ گیمینگ فانتوم 17","لپ‌تاپ گیمینگ رایزر 16"],
 "graphics-card":["کارت گرافیک RTX 4060 Gaming","کارت گرافیک RTX 4070 Super","کارت گرافیک RX 7800 XT","کارت گرافیک RTX 4080 Super","کارت گرافیک RTX 4090 OC"],
 "hard-drive":["SSD NVMe یک ترابایت","SSD NVMe دو ترابایت","هارد اکسترنال 2TB","SSD SATA یک ترابایت","هارد اکسترنال 4TB"],
 "monitor":["مانیتور گیمینگ 24 اینچ 180Hz","مانیتور گیمینگ 27 اینچ 165Hz","مانیتور QHD 27 اینچ","مانیتور UltraWide 34 اینچ","مانیتور 32 اینچ 4K"],
 "keyboard":["کیبورد مکانیکی K1 RGB","کیبورد مکانیکی K2 Wireless","کیبورد گیمینگ TKL Pro","کیبورد مکانیکی Mini 60%","کیبورد گیمینگ Optical"],
 "mouse":["ماوس گیمینگ 26000 DPI","ماوس بی‌سیم Ultra Light","ماوس ارگونومیک Pro","ماوس گیمینگ 8000Hz","ماوس بی‌سیم RGB"],
 "headphone":["هدست گیمینگ 7.1 Surround","هدست بی‌سیم Wireless Pro","هدست گیمینگ Noise Cancel","هدفون استریو Gaming","هدست RGB Tournament"],
 "hub":["هاب Type-C هفت پورت","هاب Type-C دوازده پورت","هاب USB 3.0 چهار پورت","رم‌ریدر Type-C Pro","هاب HDMI 4K"],
 "gaming-case":["کیس گیمینگ شیشه‌ای ATX","کیس Mid Tower RGB","کیس Full Tower Airflow","کیس Mini ITX Gaming","کیس Mesh Gaming Pro"],
}
BASE = {"laptop":45000000,"graphics-card":28000000,"hard-drive":3500000,"monitor":12000000,"keyboard":2500000,"mouse":1800000,"headphone":2800000,"hub":1200000,"gaming-case":5500000}

class Command(BaseCommand):
    help = "Create the default LavaGame categories, brands and at least five active products per category."

    def handle(self,*args,**kwargs):
        cats={}
        for slug,name,icon in CATEGORIES:
            c,_=Category.objects.update_or_create(slug=slug,defaults={"name":name,"icon":icon,"parent":None})
            cats[slug]=c
        brands=[]
        for name in BRANDS:
            slug=name.lower().replace(" ","-")
            b,_=Brand.objects.get_or_create(slug=slug,defaults={"name":name})
            brands.append(b)

        created=0
        for ci,(slug,_,_) in enumerate(CATEGORIES):
            for i,name in enumerate(NAMES[slug]):
                pslug=f"{slug}-{i+1}"
                brand=brands[(ci+i)%len(brands)]
                price=BASE[slug] + i*max(100000,BASE[slug]//12)
                product,_=Product.objects.update_or_create(
                    slug=pslug,
                    defaults={"name":name,"category":cats[slug],"brand":brand,
                              "price":price,"old_price":price+price//10,
                              "stock":10+i,"is_active":True,
                              "description":f"{name} مناسب برای سیستم‌های گیمینگ و استفاده حرفه‌ای."}
                )
                for key,value in [("دسته","گیمینگ"),("موجودی",str(product.stock)),("گارانتی","۱۸ ماه")]:
                    ProductSpec.objects.update_or_create(product=product,key=key,defaults={"value":value})
                created+=1
        # Attach the bundled product artwork to every seeded product.
        media_dir = Path(settings.MEDIA_ROOT) / "products"
        attached = 0
        for product in Product.objects.filter(is_active=True):
            # The bundled files are named lavagame_<product-id>_*.webp.
            matches = sorted(media_dir.glob(f"lavagame_{product.id}_*.webp"))
            if not matches:
                continue
            ProductImage.objects.filter(product=product).update(is_main=False)
            main = ProductImage.objects.filter(product=product).first()
            if main:
                main.delete()
            with matches[0].open("rb") as fh:
                ProductImage.objects.create(product=product, is_main=True, image=File(fh, name=matches[0].name))
            attached += 1

        self.stdout.write(self.style.SUCCESS(
            f"LavaGame seed complete: {created} products across {len(CATEGORIES)} categories; {attached} product images attached."
        ))

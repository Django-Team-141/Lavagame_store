// Real product photos hosted by the manufacturers' public CDNs.
// These are not AI-generated placeholders. They are used as frontend fallbacks
// when the Django API does not provide main_image.
const images = {
  laptop: [
    'https://dlcdnwebimgs.asus.com/gain/4cc342ab-c4fa-42a9-8619-a340f6119bec/w800',
    'https://dlcdnwebimgs.asus.com/gain/7841BEC8-AB6D-48BF-BA19-E5559BF23DB1/w1000/h732',
    'https://shop.asus.com/media/catalog/product/a/1/a1504v_1500x1500_4.png?bg-color=255%2C255%2C255&canvas=439%3A439&fit=bounds&format=auto&height=439&optimize=medium&width=439',
    'https://dlcdnwebimgs.asus.com/gain/4cc342ab-c4fa-42a9-8619-a340f6119bec/w800',
    'https://dlcdnwebimgs.asus.com/gain/7841BEC8-AB6D-48BF-BA19-E5559BF23DB1/w1000/h732'
  ],
  'graphics-card': [
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000'
  ],
  'hard-drive': [
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840'
  ],
  monitor: [
    'https://dlcdnwebimgs.asus.com/gain/17123866-eeb2-4e14-83c1-421d13bdcde5/w692',
    'https://dlcdnwebimgs.asus.com/gain/17123866-eeb2-4e14-83c1-421d13bdcde5/w692',
    'https://dlcdnwebimgs.asus.com/gain/17123866-eeb2-4e14-83c1-421d13bdcde5/w692',
    'https://dlcdnwebimgs.asus.com/gain/17123866-eeb2-4e14-83c1-421d13bdcde5/w692',
    'https://dlcdnwebimgs.asus.com/gain/17123866-eeb2-4e14-83c1-421d13bdcde5/w692'
  ],
  keyboard: [
    'https://assets3.razerzone.com/LF8_oJQQCinUHTRCbMaDgwDGKX4=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhe7%2Fh76%2F9815507599390%2Fbw-v4-pro-75-500x500.png',
    'https://assets3.razerzone.com/SRsaiRU8_8_QnhoHF2nq5Smizt8=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhf7%2Fh5a%2F9640099119134%2Fblackwidow-v4-75-black-2-500x500.png',
    'https://assets3.razerzone.com/nefwL6E8EF7LUXslA3aO11xsFBg=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh9f%2Fh4f%2F9946834763806%2Fbw-v4-low-tkl-hyperspeed-500x500.png',
    'https://assets3.razerzone.com/PyioLEXZN18KZQP-a244aUAyqdA=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh40%2Fhf4%2F9923675586590%2Fbw-v4-tkl-hyperspeed-500x500.png',
    'https://assets3.razerzone.com/WxxUmEsmsh9fAFVJ-JKED5wILAo=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh36%2Fh5a%2F9640099184670%2Fblackwidow-v4-2-500x500.png'
  ],
  mouse: [
    'https://assets3.razerzone.com/LQ1cxhHVvbhiSLOMjv3r4MoTo4g=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh08%2Fh61%2F9765618188318%2Fviper-v3-pro-black-500x500.png',
    'https://assets3.razerzone.com/QrFFO4KLgcSlv8V4Zhksri9dTK8=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh5a%2Fh1c%2F9821720576030%2Fbasilisk-v3-pro-35k-500x500.png',
    'https://assets3.razerzone.com/VuoDC-AaOZh-67auUdz2cfLwhgg=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh01%2Fhf3%2F9926511951902%2Fdeathadder-v4-pro-black-500x500.png',
    'https://assets3.razerzone.com/4xXGY2wFyrx2d1TN_RDJIFwdg-4=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh79%2Fh1f%2F9786703085598%2Fdeathadder-v3-hyperspeed-2-500x500.png',
    'https://assets3.razerzone.com/ZznmraYKrS_voxNy0JyDixjooig=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh35%2Fhcc%2F9594549370910%2Fcobra-pro-500x500-2.png'
  ],
  headphone: [
    'https://assets3.razerzone.com/JkD-ZQuVh5kXV3bvmyyEw9aWqxs=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh3c%2Fh54%2F9941151088670%2Fblackshark-v3-pro-black-500x500.png',
    'https://assets3.razerzone.com/PE86tnUVXn3AhJuhhtduT7ngqrg=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fha4%2Fh57%2F9941151186974%2Fblackshark-v3-black-500x500.png',
    'https://assets3.razerzone.com/XuHivIZKRD4SfHct5fPWSlB1AZw=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhf6%2Fh56%2F9941151121438%2Fblackshark-v3-x-hp-black-500x500.png',
    'https://assets3.razerzone.com/_U4ewmj0awMNagOjJfOIQTnJMoI=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhe4%2Fh1d%2F9821452468254%2Fkraken-v4-pro-2-500x500.png',
    'https://assets3.razerzone.com/0wtSpV9qVxNiIBi2w9lKNuBYL3E=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh3b%2Fh1e%2F9821452435486%2Fkraken-v4-2-500x500.png'
  ],
  hub: [
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840',
    'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/61thMtrP5rL.png?v=1723458964&width=3840'
  ],
  'gaming-case': [
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000',
    'https://nzxt.com/cdn/shop/files/h6-flow-rgb_white_10_in-build.png?v=1789302646&width=2000'
  ]
};

export function realProductImage(product) {
  const list = images[product?.category];
  if (!list?.length) return null;
  const index = Math.abs(Number(product.id || 1) - 1) % list.length;
  return list[index];
}

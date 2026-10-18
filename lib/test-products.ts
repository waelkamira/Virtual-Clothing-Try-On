import type { StoreItem } from "@/contexts/store-context"

type ProductSeed = Omit<StoreItem, "id" | "storeId" | "storeUrl" | "storeLogo">
type ProductTuple = [name: string, price: number, category: string, color: string, size: string, material: string]

const imageIds = [
  "photo-1525507119028-ed4c629a60a3",
  "photo-1542291026-7eec264c27ff",
  "photo-1551488831-00ddcb6c6bd3",
  "photo-1529139574466-a303027c1d8b",
  "photo-1515886657613-9f3515b0c78f",
  "photo-1551028719-00167b16eac5",
  "photo-1560769629-975ec94e6a86",
  "photo-1496747611176-843222e1e57c",
  "photo-1521572163474-6864f9cf17ab",
  "photo-1564584217132-2271feaeb3c5",
]

const stores = [
  { id: "amazon", name: "Amazon", brand: "Amazon Essentials", url: "amazon.com", logo: "/stores/amazon.svg" },
  { id: "nike", name: "Nike", brand: "Nike", url: "nike.com", logo: "/placeholder.svg?text=N" },
  { id: "zara", name: "Zara", brand: "Zara", url: "zara.com", logo: "/stores/zara.svg" },
  { id: "asos", name: "ASOS", brand: "ASOS DESIGN", url: "asos.com", logo: "/stores/asos.svg" },
  { id: "hm", name: "H&M", brand: "H&M", url: "hm.com", logo: "/stores/hm.svg" },
] as const

const products = ([
  [
    ["Core Cotton T-Shirt", 19.99, "T-Shirts", "White", "M", "Cotton"],
    ["Stretch Slim Jeans", 39.99, "Jeans", "Dark Blue", "32", "Denim"],
    ["Lightweight Puffer Jacket", 59.99, "Outerwear", "Black", "L", "Polyester"],
    ["Ribbed Midi Dress", 34.99, "Dresses", "Olive", "M", "Viscose"],
    ["Faux Leather Chelsea Boots", 49.99, "Footwear", "Black", "9", "Synthetic Leather"],
    ["Classic Fleece Hoodie", 32.99, "Sweatshirts", "Heather Gray", "L", "Cotton Blend"],
    ["Relaxed Chino Pants", 29.99, "Pants", "Khaki", "32", "Cotton Twill"],
    ["Quilted Crossbody Bag", 24.99, "Accessories", "Burgundy", "One Size", "Polyurethane"],
    ["Performance Running Shorts", 21.99, "Shorts", "Navy", "M", "Polyester"],
    ["Cable Knit Cardigan", 37.99, "Knitwear", "Cream", "M", "Acrylic"],
  ],
  [
    ["Air Max 270", 150, "Footwear", "Black/White", "9", "Mesh"],
    ["Air Force 1 '07", 115, "Footwear", "White", "9", "Leather"],
    ["Dri-FIT Academy T-Shirt", 35, "T-Shirts", "Black", "M", "Polyester"],
    ["Tech Fleece Joggers", 110, "Pants", "Dark Gray", "M", "Cotton Blend"],
    ["Sportswear Phoenix Hoodie", 75, "Sweatshirts", "Sail", "M", "Cotton Fleece"],
    ["Court Vision Low", 80, "Footwear", "White/Green", "10", "Synthetic Leather"],
    ["Bridgeway Windrunner Jacket", 100, "Outerwear", "Blue", "L", "Nylon"],
    ["One Luxe Leggings", 55, "Activewear", "Black", "M", "Nylon Blend"],
    ["Club Fleece Crew", 60, "Sweatshirts", "Red", "L", "Cotton Blend"],
    ["Heritage86 Cap", 28, "Accessories", "Black", "One Size", "Cotton"],
  ],
  [
    ["Structured Linen Blend Blazer", 129, "Outerwear", "Ecru", "M", "Linen Blend"],
    ["Flowy Satin Dress", 89.9, "Dresses", "Chocolate", "M", "Viscose"],
    ["Wide Leg Cargo Trousers", 59.9, "Pants", "Khaki", "M", "Cotton"],
    ["Textured Knit Polo", 49.9, "Tops", "Green", "M", "Cotton Blend"],
    ["Leather Effect Mules", 69.9, "Footwear", "Black", "9", "Polyurethane"],
    ["Oversized Denim Jacket", 79.9, "Outerwear", "Blue", "L", "Cotton Denim"],
    ["Pleated Mini Skirt", 45.9, "Skirts", "Black", "M", "Polyester"],
    ["Cropped Rib Top", 25.9, "Tops", "Cream", "S", "Viscose"],
    ["Soft Shopper Bag", 39.9, "Accessories", "Tan", "One Size", "Polyurethane"],
    ["Minimal Runner Sneakers", 69.9, "Footwear", "White/Gray", "9", "Textile"],
  ],
  [
    ["Oversized Cotton Shirt", 38, "Tops", "White", "M", "Cotton"],
    ["Curve Mom Jeans", 52, "Jeans", "Mid Blue", "12", "Denim"],
    ["Satin Cowl Neck Dress", 68, "Dresses", "Emerald", "10", "Polyester"],
    ["Oversized Trench Coat", 95, "Outerwear", "Stone", "M", "Polyester"],
    ["Chunky Lace Up Trainers", 48, "Footwear", "Cream", "8", "Synthetic"],
    ["Relaxed Sweatshirt", 42, "Sweatshirts", "Lilac", "M", "Cotton Blend"],
    ["Tailored Wide Leg Trousers", 58, "Pants", "Black", "10", "Polyester"],
    ["Fine Knit Vest", 36, "Knitwear", "Sage", "M", "Viscose"],
    ["Mini Shoulder Bag", 30, "Accessories", "Pink", "One Size", "Polyurethane"],
    ["Linen Blend Co-Ord Shorts", 40, "Shorts", "Beige", "M", "Linen Blend"],
  ],
  [
    ["Relaxed Fit Cotton Tee", 19.99, "T-Shirts", "Black", "M", "Cotton"],
    ["Slim Fit Oxford Shirt", 29.99, "Tops", "Light Blue", "M", "Cotton"],
    ["Straight Regular Jeans", 39.99, "Jeans", "Blue", "32", "Denim"],
    ["Single Breasted Blazer", 69.99, "Outerwear", "Navy", "M", "Polyester"],
    ["Ribbed Jersey Dress", 29.99, "Dresses", "Black", "M", "Viscose"],
    ["Relaxed Cargo Joggers", 34.99, "Pants", "Dark Beige", "M", "Cotton"],
    ["Canvas Low Top Sneakers", 39.99, "Footwear", "White", "9", "Canvas"],
    ["Fine Knit Sweater", 34.99, "Knitwear", "Gray", "M", "Viscose Blend"],
    ["Fitted Ribbed Tank Top", 14.99, "Tops", "White", "S", "Cotton Blend"],
    ["Mini Nylon Shoulder Bag", 24.99, "Accessories", "Black", "One Size", "Polyamide"],
  ],
] as ProductTuple[][]).map((storeProducts) => storeProducts.map(([name, price, category, color, size, material]) => ({ name, price, category, color, size, material, brand: "", image: "" })))

export const testProducts: StoreItem[] = products.flatMap((storeProducts, storeIndex) => {
  const store = stores[storeIndex]
  return storeProducts.map((product, index) => ({
    ...product,
    id: `${store.id}-test-${index + 1}`,
    brand: store.brand,
    image: `https://images.unsplash.com/${imageIds[index]}?auto=format&fit=crop&w=700&q=85`,
    storeId: store.id,
    storeUrl: store.url,
    storeLogo: store.logo,
  }))
})

export const testStores = stores.map(({ id, name, url }) => ({ id, name, url }))

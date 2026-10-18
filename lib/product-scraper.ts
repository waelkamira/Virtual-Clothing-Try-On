import type { StoreItem } from "@/contexts/store-context"
import { analyzeStoreUrl } from "./store-service"

type ProductCandidate = {
  name?: string
  price?: string | number
  image?: string
  brand?: string
  category?: string
  url?: string
  description?: string
}

function absoluteUrl(value: string | undefined, base: string) {
  if (!value) return undefined
  try {
    return new URL(value, base).toString()
  } catch {
    return undefined
  }
}

function clean(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : ""
}

function firstString(...values: unknown[]) {
  return values.map(clean).find(Boolean) || ""
}

function parsePrice(value: unknown) {
  const match = String(value ?? "").replace(/,/g, "").match(/\d+(?:\.\d{1,2})?/)
  return match ? Number(match[0]) : 0
}

function readJsonLd(html: string): ProductCandidate[] {
  const products: ProductCandidate[] = []
  const scripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []

  for (const script of scripts) {
    const raw = script.replace(/<script[^>]*>|<\/script>/gi, "").trim()
    try {
      const parsed = JSON.parse(raw)
      const values = Array.isArray(parsed) ? parsed : [parsed, ...(Array.isArray(parsed?.itemListElement) ? parsed.itemListElement : [])]
      for (const value of values) {
        const item = value?.item ?? value
        if (item && (item.name || item.image || item.offers)) {
          const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers
          products.push({
            name: item.name,
            image: Array.isArray(item.image) ? item.image[0] : item.image,
            brand: typeof item.brand === "object" ? item.brand.name : item.brand,
            category: item.category,
            url: item.url,
            description: item.description,
            price: offer?.price,
          })
        }
      }
    } catch {
      // Some stores include JSON-LD with escaped or incomplete data; use meta tags below.
    }
  }
  return products
}

function meta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i")
  return pattern.exec(html)?.[1] || ""
}

function titleFromHtml(html: string) {
  return firstString(meta(html, "og:title"), /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1])
}

function toStoreItem(candidate: ProductCandidate, index: number, sourceUrl: string): StoreItem {
  const store = analyzeStoreUrl(sourceUrl)
  const name = firstString(candidate.name, titleFromHtml("") , "Product")
  const image = absoluteUrl(firstString(candidate.image), sourceUrl) || `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(name.slice(0, 18))}`
  return {
    id: `${store.storeId}-${index}-${encodeURIComponent(name).slice(0, 32)}`,
    name,
    price: parsePrice(candidate.price),
    image,
    brand: firstString(candidate.brand, store.storeName),
    category: firstString(candidate.category, "Fashion"),
    color: "Unknown",
    size: "One size",
    material: "Unknown",
    storeId: store.storeId,
    storeUrl: sourceUrl,
    storeLogo: store.logo,
  }
}

async function extractFromPage(url: string): Promise<StoreItem[]> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; VirtualTryOn/1.0; +https://v0.app)" },
    next: { revalidate: 300 },
  })
  if (!response.ok) throw new Error(`Store returned HTTP ${response.status}`)
  const html = await response.text()
  const candidates = readJsonLd(html)
  const fallback: ProductCandidate = {
    name: firstString(meta(html, "og:title"), /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1]),
    image: firstString(meta(html, "og:image"), meta(html, "twitter:image")),
    description: meta(html, "og:description"),
    price: firstString(meta(html, "product:price:amount"), meta(html, "og:price:amount")),
  }
  const usable = candidates.length ? candidates : [fallback]
  return usable.filter((item) => item.name || item.image).slice(0, 24).map((item, index) => toStoreItem(item, index, url))
}

export class ProductScraperService {
  async extractProductsFromUrl(url: string, _useProxy = false): Promise<StoreItem[]> {
    const normalized = url.trim().match(/^https?:\/\//i) ? url.trim() : `https://${url.trim()}`
    if (!normalized || normalized === "https://") throw new Error("A store URL is required")
    new URL(normalized)
    const items = await extractFromPage(normalized)
    if (!items.length) throw new Error("No product information was found on this store page")
    return items
  }
}

export const productScraper = new ProductScraperService()

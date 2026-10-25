import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const STORES = [
  { id: "amazon", name: "Amazon", domain: "amazon.com", aliases: ["amazon"] },
  { id: "nike", name: "Nike", domain: "nike.com", aliases: ["nike"] },
  { id: "zara", name: "Zara", domain: "zara.com", aliases: ["zara"] },
  { id: "nordstrom", name: "Nordstrom", domain: "nordstrom.com", aliases: ["nordstrom"] },
  { id: "asos", name: "ASOS", domain: "asos.com", aliases: ["asos"] },
  { id: "hm", name: "H&M", domain: "hm.com", aliases: ["h&m", "hm.com"] },
  { id: "walmart", name: "Walmart", domain: "walmart.com", aliases: ["walmart"] },
  { id: "target", name: "Target", domain: "target.com", aliases: ["target"] },
  { id: "ebay", name: "eBay", domain: "ebay.com", aliases: ["ebay"] },
  { id: "etsy", name: "Etsy", domain: "etsy.com", aliases: ["etsy"] },
] as const

const searchSchema = z.object({
  q: z.string().trim().min(2).max(120),
  store: z.string().trim().max(32).optional(),
  limit: z.coerce.number().int().min(1).max(40).default(24),
})

type ShoppingResult = {
  product_id?: string
  title?: string
  source?: string
  product_link?: string
  link?: string
  thumbnail?: string
  price?: string
  extracted_price?: number
  rating?: number
  reviews?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function findStore(source: string) {
  const normalized = source.toLowerCase()
  return STORES.find((store) => store.aliases.some((alias) => normalized.includes(alias)))
}

function httpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

function parseResult(value: unknown, index: number) {
  if (!isRecord(value)) return null
  const result = value as ShoppingResult
  const store = typeof result.source === "string" ? findStore(result.source) : undefined
  const image = httpsUrl(result.thumbnail)
  const url = httpsUrl(result.product_link ?? result.link)
  const name = typeof result.title === "string" ? result.title.trim().slice(0, 240) : ""
  const price = Number.isFinite(result.extracted_price)
    ? Number(result.extracted_price)
    : Number.parseFloat((result.price ?? "").replace(/[^\d.]/g, ""))

  if (!store || !image || !url || !name || !Number.isFinite(price)) return null
  return {
    id: typeof result.product_id === "string" ? result.product_id : `${store.id}-${index}-${name}`,
    name,
    price,
    image,
    category: "Fashion",
    store: { id: store.id, name: store.name, domain: store.domain },
    url,
    rating: Number.isFinite(result.rating) ? result.rating : null,
    reviews: Number.isFinite(result.reviews) ? result.reviews : null,
  }
}

export async function GET(request: NextRequest) {
  const parsed = searchSchema.safeParse({
    q: request.nextUrl.searchParams.get("q"),
    store: request.nextUrl.searchParams.get("store") ?? undefined,
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, data: null, error: "Enter a search term of 2–120 characters." },
      { status: 400 },
    )
  }

  const { q, store: storeId, limit } = parsed.data
  const store = storeId ? STORES.find((item) => item.id === storeId) : undefined
  if (storeId && !store) {
    return NextResponse.json(
      { success: false, data: null, error: "Unsupported retailer." },
      { status: 400 },
    )
  }

  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Live store search is not configured. Set SERPAPI_API_KEY on the server.",
      },
      { status: 503 },
    )
  }

  try {
    const endpoint = new URL("https://serpapi.com/search.json")
    endpoint.searchParams.set("engine", "google_shopping")
    endpoint.searchParams.set("q", store ? `${q} site:${store.domain}` : q)
    endpoint.searchParams.set("api_key", apiKey)
    endpoint.searchParams.set("gl", "us")
    endpoint.searchParams.set("hl", "en")

    const response = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    })
    if (!response.ok) {
      console.error("[products/search] Shopping provider returned HTTP", response.status)
      return NextResponse.json(
        { success: false, data: null, error: "The shopping search provider is temporarily unavailable." },
        { status: 502 },
      )
    }

    const payload: unknown = await response.json()
    if (!isRecord(payload) || !Array.isArray(payload.shopping_results)) {
      console.error("[products/search] Shopping provider returned an invalid response")
      return NextResponse.json(
        { success: false, data: null, error: "The shopping search provider returned an invalid response." },
        { status: 502 },
      )
    }

    const products = payload.shopping_results
      .map(parseResult)
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .filter((item) => !store || item.store.id === store.id)
      .slice(0, limit)

    return NextResponse.json({ success: true, data: { products }, error: null })
  } catch (error) {
    console.error("[products/search] Search request failed", error)
    return NextResponse.json(
      { success: false, data: null, error: "Unable to search stores right now. Please try again." },
      { status: 502 },
    )
  }
}

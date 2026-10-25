"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Filter, X, ShoppingBag, Upload, Sparkles, Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

const STORE_OPTIONS = [
  ["amazon", "Amazon"],
  ["nike", "Nike"],
  ["zara", "Zara"],
  ["nordstrom", "Nordstrom"],
  ["asos", "ASOS"],
  ["hm", "H&M"],
  ["walmart", "Walmart"],
  ["target", "Target"],
  ["ebay", "eBay"],
  ["etsy", "Etsy"],
] as const

interface OnlineProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
  store: { id: string; name: string; domain: string }
  url: string
  rating: number | null
  reviews: number | null
}

export default function OnlineSearchPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<OnlineProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [tryOnProduct, setTryOnProduct] = useState<OnlineProduct | null>(null)
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [isTryOnProcessing, setIsTryOnProcessing] = useState(false)
  const [tryOnError, setTryOnError] = useState<string | null>(null)

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) setSearchQuery(query)
  }, [searchParams])

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 2) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsSearching(true)
      setSearchError(null)
      try {
        const params = new URLSearchParams({ q: query, limit: "40" })
        if (selectedStore) params.set("store", selectedStore)
        const response = await fetch(`/api/products/search?${params}`, { signal: controller.signal })
        const result: unknown = await response.json()
        if (
          !response.ok ||
          typeof result !== "object" ||
          result === null ||
          !("data" in result) ||
          typeof result.data !== "object" ||
          result.data === null ||
          !("products" in result.data) ||
          !Array.isArray(result.data.products)
        ) {
          const message =
            typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
              ? result.error
              : "Product search failed."
          throw new Error(message)
        }
        setSearchResults(result.data.products as OnlineProduct[])
      } catch (error) {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : "Unable to search stores right now."
        setSearchError(message)
        setSearchResults([])
        toast({ title: "Search unavailable", description: message, variant: "destructive" })
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [searchQuery, selectedStore, toast])

  const handleSearch = () => {
    setSearchQuery((query) => query.trim())
  }

  const filteredResults = searchResults
    .filter((product) => !category || product.category.toLowerCase().includes(category))
    .filter((product) => !minPrice || product.price >= Number(minPrice))
    .filter((product) => !maxPrice || product.price <= Number(maxPrice))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0)
      return 0
    })

  const handleOpenTryOn = (product: any) => {
    setTryOnProduct(product)
    setTryOnResult(null)
    setTryOnError(null)
    setUserPhotoUrl(typeof window !== "undefined" ? sessionStorage.getItem("try-on-photo-url") : null)
  }

  const generateTryOn = async (photoUrl: string) => {
    if (!tryOnProduct) return
    setIsTryOnProcessing(true)
    setTryOnError(null)
    setUserPhotoUrl(photoUrl)
    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhotoUrl: photoUrl,
          itemImageUrl: tryOnProduct.image,
          category: tryOnProduct.category,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.url) throw new Error(result.error || "Try-on generation failed")
      setTryOnResult(result.url)
    } catch (error) {
      setTryOnError(error instanceof Error ? error.message : "Try-on generation failed")
    } finally {
      setIsTryOnProcessing(false)
    }
  }

  const handleTryOnPhoto = async (file: File) => {
    try {
      const uploadData = new FormData()
      uploadData.append("file", file)
      const uploadResponse = await fetch("/api/upload", { method: "POST", body: uploadData })
      const uploaded = await uploadResponse.json()
      if (!uploadResponse.ok || !uploaded.url) throw new Error(uploaded.error || "Photo upload failed")
      sessionStorage.setItem("try-on-photo-url", uploaded.url)
      await generateTryOn(uploaded.url)
    } catch (error) {
      setTryOnError(error instanceof Error ? error.message : "Photo upload failed")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-44 sm:pb-36">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Search Online</h1>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Search size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search for any product online..."
                className="pl-10 pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    className="p-1 hover:bg-background/80 rounded-full transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                )}
                <button
                  className="p-1 hover:bg-background/80 rounded-full transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} className={showFilters ? "text-orange-500" : "text-muted-foreground"} />
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => handleSearch()}
            disabled={isSearching || searchQuery.trim().length < 2}
            >
              {isSearching ? "Searching..." : "Search Online"}
            </Button>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="font-medium mb-2">Filter Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Price Range</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" min="0" placeholder="Min" className="text-sm" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
                      <span>-</span>
                      <Input type="number" min="0" placeholder="Max" className="text-sm" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Store</label>
                    <select value={selectedStore} onChange={(event) => setSelectedStore(event.target.value)} className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="">All Stores</option>
                      {STORE_OPTIONS.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="">All Categories</option>
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="dresses">Dresses</option>
                      <option value="outerwear">Outerwear</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Sort By</label>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isSearching ? (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Searching online stores...</h3>
            <p className="text-muted-foreground">This may take a moment</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Search Results <span className="text-sm font-normal text-muted-foreground">from supported retailers</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredResults.map((result) => (
                <Card key={result.id} className="overflow-hidden group">
                  <div className="relative aspect-[3/4]">
                    <Image src={result.image || "/placeholder.svg"} alt={result.name} fill unoptimized className="object-cover" />
                    <Button
                      type="button"
                      size="sm"
                      className="absolute left-3 right-3 top-3 z-10 bg-orange-500/95 shadow-lg backdrop-blur-sm hover:bg-orange-600"
                      onClick={() => handleOpenTryOn(result)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Try On
                    </Button>
                  </div>

                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-700 dark:text-orange-300">{result.store.name}</span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{result.name}</h3>
                    <p className="font-bold text-orange-500 mt-1">${result.price}</p>
                    {result.rating !== null && <p className="text-xs text-muted-foreground mt-1">★ {result.rating.toFixed(1)}{result.reviews ? ` · ${result.reviews} reviews` : ""}</p>}
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-orange-600 underline underline-offset-2">
                      View product
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

          </>
        ) : searchError ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Live search is unavailable</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{searchError}</p>
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any products matching "{searchQuery}". Try a different search term or browse our stores.
            </p>
            <Button variant="outline" className="mx-auto" asChild>
              <Link href="/stores">Browse Stores</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Search for products online</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a search term above to find products from various online stores that you can virtually try on.
            </p>
          </div>
        )}
      </main>

      <Footer />

      <Dialog open={Boolean(tryOnProduct)} onOpenChange={(open) => !open && setTryOnProduct(null)}>
        <DialogContent className="z-[200] max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto overflow-hidden border-orange-500/20 bg-background/95 p-0 backdrop-blur-xl">
          <DialogHeader className="border-b border-border px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Virtual Try-On
            </DialogTitle>
            <DialogDescription>
              {tryOnProduct ? `See ${tryOnProduct.name} on you in seconds.` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            {tryOnResult ? (
              <div className="space-y-4">
                <div className="relative mx-auto aspect-square max-h-[55vh] overflow-hidden rounded-2xl bg-muted">
                  <Image src={tryOnResult} alt={`Virtual try-on result for ${tryOnProduct?.name}`} fill className="object-contain" unoptimized />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">AI styling complete. You can close this window and keep browsing.</p>
                  <Button variant="outline" onClick={() => setTryOnResult(null)}>Try Again</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-dashed border-orange-500/40 bg-orange-500/5 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                    {isTryOnProcessing ? <Loader2 className="h-7 w-7 animate-spin" /> : <Upload className="h-7 w-7" />}
                  </div>
                  <h3 className="mb-2 font-semibold">{isTryOnProcessing ? "Creating your look..." : userPhotoUrl ? "Use this photo or choose another" : "Choose a photo to begin"}</h3>
                  <p className="mx-auto mb-5 max-w-md text-sm text-muted-foreground">
                    {isTryOnProcessing ? "Our AI is applying the selected item to your image. This may take a moment." : "Use your saved photo or upload a new clear full-body image."}
                  </p>
                  {userPhotoUrl && !isTryOnProcessing && (
                    <div className="mx-auto mb-4 flex max-w-xs items-center gap-3 rounded-xl border border-orange-500/30 bg-background/70 p-2 text-left">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted"><Image src={userPhotoUrl} alt="Your saved photo" fill className="object-cover" unoptimized /></div>
                      <div><p className="text-sm font-medium">Saved photo ready</p><p className="text-xs text-muted-foreground">Use it for this product</p></div>
                      <Button size="sm" className="ml-auto bg-orange-500 hover:bg-orange-600" onClick={() => void generateTryOn(userPhotoUrl)}>Use</Button>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    <label className={`inline-flex cursor-pointer items-center rounded-full bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600 ${isTryOnProcessing ? "pointer-events-none opacity-60" : ""}`}>
                      <Upload className="mr-2 h-4 w-4" />
                      {isTryOnProcessing ? "Processing..." : "Upload New Photo"}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={isTryOnProcessing} onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) void handleTryOnPhoto(file)
                      }} />
                    </label>
                  </div>
                  {tryOnError && <p className="mt-4 text-sm text-destructive">{tryOnError}</p>}
                </div>
                {tryOnProduct && (
                  <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted"><Image src={tryOnProduct.image || "/placeholder.svg"} alt={tryOnProduct.name} fill unoptimized className="object-cover" /></div>
                    <div><p className="font-medium">{tryOnProduct.name}</p><p className="text-sm text-muted-foreground">{tryOnProduct.store?.name} · ${tryOnProduct.price}</p></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

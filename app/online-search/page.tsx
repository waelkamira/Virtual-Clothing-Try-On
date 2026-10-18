"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Filter, X, ShoppingBag, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/contexts/store-context"
import { useToast } from "@/components/ui/use-toast"
import { testProducts } from "@/lib/test-products"

export default function OnlineSearchPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { importFromUrl, loading, error } = useStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [searchParams])

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return

    setIsSearching(true)
    setSearchResults([])

    try {
      // Use a deterministic local catalog so the try-on flow can be tested
      // without depending on third-party store APIs or unstable scraping.
      await new Promise((resolve) => setTimeout(resolve, 350))

      const normalizedQuery = query.trim().toLowerCase()
      const matchingProducts = testProducts.filter((product) =>
        [product.name, product.brand, product.category, product.color, product.storeId]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      const results = (matchingProducts.length > 0 ? matchingProducts : testProducts).slice(0, 50).map((product) => ({
        ...product,
        store: { name: product.storeId === "hm" ? "H&M" : product.storeId === "asos" ? "ASOS" : product.storeId.charAt(0).toUpperCase() + product.storeId.slice(1), logo: product.storeLogo },
        url: `https://${product.storeUrl}/products/${product.id}`,
      }))

      setSearchResults(results)
    } catch (err) {
      toast({
        title: "Search failed",
        description: "Failed to search for products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleTryOn = () => {
    const selectedProducts = searchResults.filter((item) => selectedItems.includes(item.id))

    if (selectedProducts.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to try on",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would import these products and redirect to try-on page
    toast({
      title: "Items selected for try-on",
      description: `${selectedProducts.length} items will be prepared for virtual try-on`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
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
              disabled={isSearching || !searchQuery.trim()}
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
                      <Input type="number" placeholder="Min" className="text-sm" />
                      <span>-</span>
                      <Input type="number" placeholder="Max" className="text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Store</label>
                    <select className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="">All Stores</option>
                      <option value="amazon">Amazon</option>
                      <option value="asos">ASOS</option>
                      <option value="hm">H&M</option>
                      <option value="zara">Zara</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <select className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="">All Categories</option>
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="dresses">Dresses</option>
                      <option value="outerwear">Outerwear</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Sort By</label>
                    <select className="w-full p-2 rounded-md border border-input bg-background">
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest</option>
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
        ) : searchResults.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {searchResults.map((result) => (
                <Card key={result.id} className="overflow-hidden group">
                  <div className="relative aspect-[3/4]">
                    <Image src={result.image || "/placeholder.svg"} alt={result.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleSelectItem(result.id)}
                      >
                        {selectedItems.includes(result.id) ? <>Selected</> : <>Select for Try-On</>}
                      </Button>
                    </div>

                    {selectedItems.includes(result.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 relative rounded-full overflow-hidden bg-background">
                        <Image
                          src={result.store.logo || "/placeholder.svg"}
                          alt={result.store.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{result.store.name}</span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{result.name}</h3>
                    <p className="font-bold text-orange-500 mt-1">${result.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="fixed bottom-4 left-0 right-0 z-10 px-4">
                <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Selected Items ({selectedItems.length})</h3>
                      <p className="text-sm text-muted-foreground">Ready to try on these items?</p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      onClick={handleTryOn}
                    >
                      Try On Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
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
    </div>
  )
}


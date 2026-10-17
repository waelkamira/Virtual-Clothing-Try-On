"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Filter, X, Heart, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/contexts/store-context"

export default function WebsiteSearchPage() {
  const searchParams = useSearchParams()
  const {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    resetFilters,
    selectItem,
    unselectItem,
    selectedItems,
  } = useStore()

  const [showFilters, setShowFilters] = useState(false)

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams, setSearchQuery])

  const handleSearch = () => {
    // The search is already handled by the store context
    // This is just a placeholder for any additional logic
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
          <h1 className="text-2xl font-bold">Search Our Collection</h1>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Search size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search our collection..."
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

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Price Range</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="text-sm"
                        value={filters.priceRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value) || 0
                          updateFilters("priceRange", [min, filters.priceRange[1]])
                        }}
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="text-sm"
                        value={filters.priceRange[1]}
                        onChange={(e) => {
                          const max = Number(e.target.value) || 1000
                          updateFilters("priceRange", [filters.priceRange[0], max])
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Categories</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes"].map((category) => (
                        <button
                          key={category}
                          className={`px-3 py-1 text-sm rounded-full ${
                            filters.categories.includes(category)
                              ? "bg-orange-500 text-white"
                              : "bg-background border border-input"
                          }`}
                          onClick={() => {
                            const newCategories = filters.categories.includes(category)
                              ? filters.categories.filter((c) => c !== category)
                              : [...filters.categories, category]
                            updateFilters("categories", newCategories)
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Colors</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Black", "White", "Red", "Blue", "Green"].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${
                            filters.colors.includes(color)
                              ? "ring-2 ring-orange-500 ring-offset-2"
                              : "border border-input"
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => {
                            const newColors = filters.colors.includes(color)
                              ? filters.colors.filter((c) => c !== color)
                              : [...filters.colors, color]
                            updateFilters("colors", newColors)
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {filteredItems.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Search Results ({filteredItems.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative aspect-[3/4]">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                          if (selectedItems.some((i) => i.id === item.id)) {
                            unselectItem(item.id)
                          } else {
                            selectItem(item)
                          }
                        }}
                      >
                        {selectedItems.some((i) => i.id === item.id) ? <>Selected</> : <>Select for Try-On</>}
                      </Button>
                    </div>

                    {selectedItems.some((i) => i.id === item.id) && (
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
                          src={item.storeLogo || `/placeholder.svg?text=${item.brand.charAt(0)}`}
                          alt={item.brand}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.brand}</span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="font-bold text-orange-500">${item.price}</p>
                      <button className="p-1 text-muted-foreground hover:text-orange-500 transition-colors">
                        <Heart size={16} />
                      </button>
                    </div>
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
                      asChild
                    >
                      <Link href="/try-on">
                        Try On Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any products matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button variant="outline" className="mx-auto" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, X, Heart, ArrowRight, Check } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SearchPage() {
  const {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    resetFilters,
    selectedItems,
    selectItem,
    unselectItem,
  } = useStore()
  const [isClient, setIsClient] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)

    // Load search history from localStorage
    const history = localStorage.getItem("searchHistory")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 1) {
      // Generate suggestions based on items and search history
      const itemSuggestions = items
        .map((item) => item.name)
        .filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)

      const historySuggestions = searchHistory
        .filter((term) => term.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 2)

      const categorySuggestions = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes"]
        .filter((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 2)

      // Combine and deduplicate suggestions
      const allSuggestions = [...new Set([...historySuggestions, ...itemSuggestions, ...categorySuggestions])]
      setSuggestions(allSuggestions.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [searchQuery, items, searchHistory])

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return

    setSearchQuery(query)

    // Add to search history if not already present
    if (!searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    }

    // Clear suggestions
    setSuggestions([])
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  const handleSelectItem = (item: any) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      unselectItem(item.id)
    } else {
      selectItem(item)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8">Loading search...</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Search</h1>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for clothing items..."
                className="w-full pl-10 pr-12 py-3 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-w-3xl bg-card border border-border rounded-lg shadow-lg">
                <ul className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-orange-500/10 flex items-center"
                        onClick={() => handleSearch(suggestion)}
                      >
                        <Search size={16} className="mr-2 text-muted-foreground" />
                        <span>{suggestion}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-1">
                    {["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"].map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onChange={() => {
                            const newCategories = filters.categories.includes(category)
                              ? filters.categories.filter((c) => c !== category)
                              : [...filters.categories, category]
                            updateFilters("categories", newCategories)
                          }}
                          className="w-4 h-4 rounded border-input text-orange-500 focus:ring-orange-500"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0] || ""}
                      onChange={(e) => {
                        const min = Number.parseInt(e.target.value) || 0
                        updateFilters("priceRange", [min, filters.priceRange[1]])
                      }}
                      className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1] || ""}
                      onChange={(e) => {
                        const max = Number.parseInt(e.target.value) || 200
                        updateFilters("priceRange", [filters.priceRange[0], max])
                      }}
                      className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Red", "Blue", "Green", "Black", "White", "Gray", "Brown", "Pink"].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border ${
                          filters.colors.includes(color)
                            ? "border-orange-500 ring-2 ring-orange-500 ring-offset-2 ring-offset-background"
                            : "border-border"
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
            </motion.div>
          )}

          {/* Search history */}
          {!searchQuery && searchHistory.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Searches</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-orange-500"
                  onClick={clearSearchHistory}
                >
                  Clear History
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-background/50 border border-border rounded-full text-sm hover:border-orange-500/50 hover:bg-orange-500/10 transition-colors"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {searchQuery && (
            <div>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="bg-background/50 border border-border p-1 mb-6">
                  <TabsTrigger value="all" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    All Results
                  </TabsTrigger>
                  <TabsTrigger
                    value="tops"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Tops
                  </TabsTrigger>
                  <TabsTrigger
                    value="bottoms"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Bottoms
                  </TabsTrigger>
                  <TabsTrigger
                    value="dresses"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Dresses
                  </TabsTrigger>
                  <TabsTrigger
                    value="outerwear"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Outerwear
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <SearchResults items={filteredItems} selectedItems={selectedItems} onSelectItem={handleSelectItem} />
                </TabsContent>

                <TabsContent value="tops" className="mt-0">
                  <SearchResults
                    items={filteredItems.filter(
                      (item) =>
                        item.category.toLowerCase().includes("top") ||
                        item.category.toLowerCase().includes("shirt") ||
                        item.category.toLowerCase().includes("blouse"),
                    )}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                  />
                </TabsContent>

                <TabsContent value="bottoms" className="mt-0">
                  <SearchResults
                    items={filteredItems.filter(
                      (item) =>
                        item.category.toLowerCase().includes("bottom") ||
                        item.category.toLowerCase().includes("pant") ||
                        item.category.toLowerCase().includes("jean") ||
                        item.category.toLowerCase().includes("skirt"),
                    )}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                  />
                </TabsContent>

                <TabsContent value="dresses" className="mt-0">
                  <SearchResults
                    items={filteredItems.filter((item) => item.category.toLowerCase().includes("dress"))}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                  />
                </TabsContent>

                <TabsContent value="outerwear" className="mt-0">
                  <SearchResults
                    items={filteredItems.filter(
                      (item) =>
                        item.category.toLowerCase().includes("outerwear") ||
                        item.category.toLowerCase().includes("jacket") ||
                        item.category.toLowerCase().includes("coat"),
                    )}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Selected items */}
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
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Search results component
function SearchResults({ items, selectedItems, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Search size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">No results found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any items matching your search criteria. Try adjusting your filters or search term.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="group"
        >
          <div
            className={`bg-card/50 backdrop-blur-md border ${
              selectedItems.some((i) => i.id === item.id) ? "border-orange-500" : "border-border"
            } rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10`}
          >
            <div className="relative aspect-[3/4]">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />

              {selectedItems.some((i) => i.id === item.id) && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <Check size={14} />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                <Button
                  size="sm"
                  className={`w-full ${
                    selectedItems.some((i) => i.id === item.id)
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                  onClick={() => onSelectItem(item)}
                >
                  {selectedItems.some((i) => i.id === item.id) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    <>
                      Try On
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-sm line-clamp-1 group-hover:text-orange-500 transition-colors">
                {item.name}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">{item.brand}</span>
                <span className="font-semibold text-orange-500">${item.price}</span>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="flex">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <span
                      key={size}
                      className={`w-6 h-6 flex items-center justify-center text-xs ${
                        item.size === size ? "text-orange-500 font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <button className="p-2 rounded-full text-muted-foreground hover:text-orange-500 transition-colors">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}


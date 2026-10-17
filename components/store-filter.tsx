"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export default function StoreFilter() {
  const { stores, selectedStore, selectStore, searchQuery, setSearchQuery, filters, updateFilters, resetFilters } =
    useStore()

  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("stores")

  // Get unique values for filter options
  const uniqueBrands = [...new Set(stores.map((store) => store.name))]
  const uniqueCategories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]
  const uniqueColors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Brown", "Pink", "Purple", "Orange", "Yellow"]
  const uniqueSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
  const uniqueMaterials = ["Cotton", "Polyester", "Wool", "Leather", "Denim", "Silk", "Linen", "Cashmere"]

  const handlePriceChange = (value: number[]) => {
    updateFilters("priceRange", [value[0], value[1]])
  }

  const toggleFilter = (filterType: string, value: string) => {
    const currentFilters = filters[filterType as keyof typeof filters] as string[]
    if (currentFilters.includes(value)) {
      updateFilters(
        filterType,
        currentFilters.filter((v) => v !== value),
      )
    } else {
      updateFilters(filterType, [...currentFilters, value])
    }
  }

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl overflow-hidden">
      {/* Search and filter header */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`border-orange-500/30 ${showFilters ? "bg-orange-500/10 text-orange-500" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
          </Button>
        </div>
      </div>

      {/* Filters section */}
      {showFilters && (
        <div className="p-4 border-b border-border">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="stores" className="flex-1">
                Stores
              </TabsTrigger>
              <TabsTrigger value="price" className="flex-1">
                Price
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex-1">
                Categories
              </TabsTrigger>
              <TabsTrigger value="more" className="flex-1">
                More
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stores" className="mt-2">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className={`store-logo ${selectedStore?.id === store.id ? "active" : ""}`}
                    onClick={() => selectStore(store.id)}
                  >
                    <Image
                      src={store.logo || `/placeholder.svg?text=${store.name}`}
                      alt={store.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="price" className="mt-2">
              <div className="px-2">
                <div className="mb-6">
                  <Slider
                    defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                    max={200}
                    step={5}
                    onValueChange={handlePriceChange}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.categories.includes(category)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-background/50 text-muted-foreground border-border hover:border-orange-500/50"
                    }`}
                    onClick={() => toggleFilter("categories", category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="more" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border transition-colors ${
                          filters.colors.includes(color)
                            ? "ring-2 ring-orange-500 ring-offset-2"
                            : "border-border hover:border-orange-500/50"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => toggleFilter("colors", color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        className={`w-8 h-8 flex items-center justify-center text-xs rounded-full border transition-colors ${
                          filters.sizes.includes(size)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-background/50 text-muted-foreground border-border hover:border-orange-500/50"
                        }`}
                        onClick={() => toggleFilter("sizes", size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueMaterials.map((material) => (
                      <button
                        key={material}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                          filters.materials.includes(material)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-background/50 text-muted-foreground border-border hover:border-orange-500/50"
                        }`}
                        onClick={() => toggleFilter("materials", material)}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {(selectedStore ||
        filters.categories.length > 0 ||
        filters.colors.length > 0 ||
        filters.sizes.length > 0 ||
        filters.materials.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 200) && (
        <div className="px-4 py-2 border-b border-border bg-orange-500/5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Active filters:</span>

            {selectedStore && (
              <div className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <span>{selectedStore.name}</span>
                <button onClick={() => selectStore("")} className="hover:text-orange-600">
                  <X size={12} />
                </button>
              </div>
            )}

            {filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? (
              <div className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <span>
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
                <button onClick={() => updateFilters("priceRange", [0, 200])} className="hover:text-orange-600">
                  <X size={12} />
                </button>
              </div>
            ) : null}

            {filters.categories.map((category) => (
              <div
                key={category}
                className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <span>{category}</span>
                <button onClick={() => toggleFilter("categories", category)} className="hover:text-orange-600">
                  <X size={12} />
                </button>
              </div>
            ))}

            {filters.colors.map((color) => (
              <div
                key={color}
                className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <span>{color}</span>
                <button onClick={() => toggleFilter("colors", color)} className="hover:text-orange-600">
                  <X size={12} />
                </button>
              </div>
            ))}

            {filters.sizes.map((size) => (
              <div
                key={size}
                className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <span>{size}</span>
                <button onClick={() => toggleFilter("sizes", size)} className="hover:text-orange-600">
                  <X size={12} />
                </button>
              </div>
            ))}

            {filters.materials.map((material) => (
              <div
                key={material}
                className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <span>{material}</span>
                <button onClick={() => toggleFilter("materials", material)} className="hover:text-orange-600">
                  <X size={12} />
                </button>
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-orange-500 p-0 h-auto"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


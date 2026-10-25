"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Heart, ShoppingBag, Check, X } from "lucide-react"
import Footer from "@/components/footer"
import StoreFilter from "@/components/store-filter"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/components/ui/use-toast"

export default function CatalogPage() {
  const { filteredItems, selectedItems, selectItem, unselectItem, trialCount, toggleFavorite, isFavorite, resetFilters } = useStore()
  const { user } = useUser()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSelectItem = (item: any) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      unselectItem(item.id)
    } else {
      if (trialCount <= 0 && selectedItems.length >= 5 && user?.subscription === "free") {
        toast({
          title: "Free trial limit reached",
          description: "Upgrade to Premium to try on unlimited items.",
          variant: "destructive",
        })
        return
      }
      selectItem(item)
      toast({
        title: "Item selected",
        description: `${item.name} has been added to your try-on list.`,
      })
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8">Loading catalog...</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Browse Catalog</h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Free trials remaining:</span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded-md font-medium">{trialCount}/5</span>
            </div>
          </div>

          <div className="mb-6">
            <StoreFilter />
          </div>

          {selectedItems.length > 0 && (
            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-orange-500">Selected Items ({selectedItems.length})</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedItems.length < 5
                      ? `You can select ${5 - selectedItems.length} more items with your free trial.`
                      : "You've reached the maximum number of items for your free trial."}
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  asChild
                >
                  <Link href="/try-on">
                    Try On Selected Items
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {selectedItems.map((item) => (
                  <div key={item.id} className="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden group">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      onClick={() => unselectItem(item.id)}
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card-3d group"
                >
                  <div
                    className={`bg-card/50 backdrop-blur-md border ${
                      selectedItems.some((i) => i.id === item.id) ? "border-orange-500" : "border-border"
                    } rounded-xl overflow-hidden`}
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />

                      {selectedItems.some((i) => i.id === item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                          <Check size={14} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                        <Button
                          size="sm"
                          className={`w-full ${
                            selectedItems.some((i) => i.id === item.id)
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                          onClick={() => handleSelectItem(item)}
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

                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                        </div>
                        <span className="text-sm font-semibold text-orange-500">${item.price}</span>
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex gap-1">
                          {["XS", "S", "M", "L", "XL"].map((size) => (
                            <span
                              key={size}
                              className={`w-5 h-5 flex items-center justify-center text-[10px] ${
                                item.size === size ? "text-orange-500 font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {size}
                            </span>
                          ))}
                        </div>

                        <button
                          className={`p-1 rounded-full transition-colors ${isFavorite(item.id) ? "text-orange-500" : "text-muted-foreground hover:text-orange-500"}`}
                          onClick={() => toggleFavorite(item)}
                          aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart size={16} className={isFavorite(item.id) ? "fill-current" : ""} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                <ShoppingBag size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">No items found</h2>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any items matching your current filters. Try adjusting your search criteria or browse
                our full catalog.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                onClick={resetFilters}
              >
                View All Items
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}


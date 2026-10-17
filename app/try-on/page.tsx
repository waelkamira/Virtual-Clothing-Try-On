"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ShoppingBag, Share2, Heart } from "lucide-react"
import Navbar from "@/components/navbar"
import EnhancedTryOn from "@/components/enhanced-try-on"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { useToast } from "@/components/ui/use-toast"

export default function TryOnPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const { selectedItems, trialCount } = useStore()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePhotoCapture = (imageUrl: string | null) => {
    setUploadedImage(imageUrl)
  }

  const handleShare = () => {
    if (!uploadedImage) {
      toast({
        title: "No image to share",
        description: "Please upload a photo and try on items first.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would open a share dialog
    toast({
      title: "Sharing",
      description: "Opening share dialog...",
    })

    // For demo purposes, we'll just simulate a successful share
    setTimeout(() => {
      toast({
        title: "Shared successfully",
        description: "Your virtual try-on image has been shared.",
      })
    }, 1500)
  }

  const handleSave = () => {
    if (!uploadedImage) {
      toast({
        title: "No image to save",
        description: "Please upload a photo and try on items first.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Outfit saved",
      description: "Your outfit has been saved to your profile.",
    })
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8">Loading try-on interface...</h1>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold">Virtual Try-On</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Free trials remaining:</span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded-md font-medium">{trialCount}/5</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <EnhancedTryOn onPhotoCapture={handlePhotoCapture} />
              </motion.div>

              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 flex justify-center gap-4"
                >
                  <Button
                    variant="outline"
                    className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                    onClick={handleSave}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Save Outfit
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Selected Items</h2>

                {selectedItems.length > 0 ? (
                  <div className="space-y-4">
                    {selectedItems.map((item, index) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-background/50 rounded-lg border border-border">
                        <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />

                          {/* Store logo */}
                          <div className="absolute bottom-0 right-0 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-tl-md p-0.5">
                            <Image
                              src={item.storeLogo || "/placeholder.svg"}
                              alt={item.brand}
                              width={16}
                              height={8}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded">
                              {item.size}
                            </span>
                            <span className="text-sm font-medium text-orange-500">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Total Items:</span>
                        <span>{selectedItems.length}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Price:</span>
                        <span className="text-orange-500">
                          ${selectedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        asChild
                      >
                        <Link href="/checkout">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          <span>Proceed to Checkout</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="font-medium mb-2">No items selected</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Select items from our catalog to try them on virtually.
                    </p>
                    <Button
                      variant="outline"
                      className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                      asChild
                    >
                      <Link href="/catalog">Browse Catalog</Link>
                    </Button>
                  </div>
                )}
              </div>

              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-6 bg-card/50 backdrop-blur-md border border-border rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4">Recommended For You</h2>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group relative">
                        <div className="aspect-square bg-background/50 rounded-md overflow-hidden border border-border">
                          <Image
                            src={`/placeholder.svg?height=100&width=100&text=Item${i}`}
                            alt={`Recommended item ${i}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />

                          {/* Store logo */}
                          <div className="absolute bottom-1 right-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-md p-0.5">
                            <Image
                              src={`/stores/${["amazon", "asos", "zara"][i - 1]}.svg`}
                              alt="Store"
                              width={16}
                              height={8}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full max-w-[80%] bg-orange-500 hover:bg-orange-600"
                          >
                            Try On
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-orange-500" asChild>
                      <Link href="/catalog">View More Recommendations</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


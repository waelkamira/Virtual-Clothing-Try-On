"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingBag, Heart, Share2, Sparkles } from "lucide-react"
import type { ProductData } from "@/app/actions/fetch-product"

interface ProductCardProps {
  product: ProductData
  onTryOn: () => void
}

export function ProductCard({ product, onTryOn }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden w-full max-w-md"
    >
      <div className="relative aspect-square">
        <Image
          src={product.images[currentImageIndex] || "/placeholder.svg?height=400&width=300"}
          alt={product.title}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=300"
          }}
        />

        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
            >
              &gt;
            </button>
          </>
        )}

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-white"}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-200 line-clamp-2">{product.title}</h3>
            <p className="text-sm text-amber-700/70 dark:text-amber-300/70">{product.brand}</p>
          </div>
          <p className="text-lg font-bold text-amber-600">{product.price}</p>
        </div>

        <p className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTryOn}
            className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            Try It On
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md text-amber-800 dark:text-amber-200"
          >
            <ShoppingBag className="h-4 w-4" />
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: product.title,
                    url: product.url,
                  })
                  .catch((err) => {
                    console.error("Error sharing:", err)
                  })
              } else {
                navigator.clipboard.writeText(product.url)
                alert("Link copied to clipboard!")
              }
            }}
            className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md text-amber-800 dark:text-amber-200"
          >
            <Share2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}


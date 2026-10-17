"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link, Search, Loader2, ExternalLink } from "lucide-react"
import { fetchProductFromUrl, type ProductData } from "@/app/actions/fetch-product"

interface ProductLinkInputProps {
  onProductFetched: (product: ProductData) => void
}

export function ProductLinkInput({ onProductFetched }: ProductLinkInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showExamples, setShowExamples] = useState(false)

  const exampleLinks = [
    { name: "T-Shirt", url: "https://example.com/product/tshirt" },
    { name: "Summer Dress", url: "https://example.com/product/dress" },
    { name: "Denim Jeans", url: "https://example.com/product/jeans" },
    { name: "Bomber Jacket", url: "https://example.com/product/jacket" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a product URL")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Validate URL format
      try {
        new URL(url) // This will throw if URL is invalid
      } catch (err) {
        setError("Please enter a valid URL")
        setIsLoading(false)
        return
      }

      const productData = await fetchProductFromUrl(url)

      if (productData.error) {
        // Show warning but still proceed with the product data
        setError(`Note: ${productData.error}. Using sample product data.`)
        onProductFetched(productData)
        setUrl("") // Clear input after fetch
      } else {
        onProductFetched(productData)
        setUrl("") // Clear input after successful fetch
      }
    } catch (err) {
      setError("Failed to fetch product. Using sample product data instead.")
      // Still provide a fallback product
      const fallbackProduct: ProductData = {
        title: "Sample Product",
        price: "$29.99",
        images: ["/placeholder.svg?height=400&width=300&text=Sample+Product"],
        description: "This is a sample product for demonstration purposes.",
        brand: "Demo Brand",
        url: url || "https://example.com/product",
      }
      onProductFetched(fallbackProduct)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl)
    setShowExamples(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-4 w-full max-w-2xl mx-auto mb-8"
    >
      <h2 className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-3 flex items-center">
        <Link className="h-5 w-5 mr-2 text-amber-500" />
        Paste Product Link
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/product/123"
            className="w-full px-4 py-2 pr-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-amber-800 dark:text-amber-200 placeholder-amber-400/50"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500/50">
            <Search className="h-4 w-4" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isLoading}
          type="submit"
          className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Fetching</span>
            </>
          ) : (
            <span>Fetch Product</span>
          )}
        </motion.button>
      </form>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-amber-600 dark:text-amber-400"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-amber-700/60 dark:text-amber-300/60">Try an example:</span>
        <div className="flex flex-wrap gap-2">
          {exampleLinks.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example.url)}
              className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-amber-700/60 dark:text-amber-300/60 flex items-center gap-1">
        <ExternalLink className="h-3 w-3" />
        <span>For demo purposes, we're using sample product data instead of actual website scraping</span>
      </p>
    </motion.div>
  )
}


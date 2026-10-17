"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, Share2, ThumbsUp, ThumbsDown, RefreshCw, ShoppingBag } from "lucide-react"
import type { ProductData } from "@/app/actions/fetch-product"

interface TryOnResultProps {
  userPhoto: string
  product: ProductData
  onReset: () => void
}

export function TryOnResult({ userPhoto, product, onReset }: TryOnResultProps) {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null)

  const handleDownload = () => {
    // In a real app, this would download the actual try-on result
    // For demo purposes, we'll just open the image in a new tab
    window.open(userPhoto, "_blank")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Virtual try-on: ${product.title}`,
          text: `Check out how ${product.title} looks on me!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-4 w-full max-w-md"
    >
      <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4 text-center">Virtual Try-On Result</h2>

      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg">
        {/* This would be the actual try-on result in a real app */}
        {/* For demo purposes, we're just showing the user's photo with an overlay */}
        <Image src={userPhoto || "/placeholder.svg"} alt="Your photo" fill className="object-cover" />

        {/* Simulated product overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

        {/* Product name watermark */}
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
          {product.title}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-amber-800 dark:text-amber-200">{product.title}</h3>
          <p className="text-sm text-amber-700/70 dark:text-amber-300/70">{product.price}</p>
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
        >
          <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </a>
      </div>

      <div className="flex justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm text-amber-800 dark:text-amber-200"
        >
          <Download className="h-4 w-4" />
          Save
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm text-amber-800 dark:text-amber-200"
        >
          <Share2 className="h-4 w-4" />
          Share
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm text-amber-800 dark:text-amber-200"
        >
          <RefreshCw className="h-4 w-4" />
          Try Another
        </motion.button>
      </div>

      <div className="border-t border-white/20 pt-4">
        <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">How does this look?</p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFeedback("like")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
              feedback === "like"
                ? "bg-green-500/20 text-green-700 dark:text-green-300"
                : "bg-white/20 text-amber-800 dark:text-amber-200"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            Looks Great
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFeedback("dislike")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
              feedback === "dislike"
                ? "bg-red-500/20 text-red-700 dark:text-red-300"
                : "bg-white/20 text-amber-800 dark:text-amber-200"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            Not Quite Right
          </motion.button>
        </div>

        {feedback === "dislike" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 text-sm text-amber-700/70 dark:text-amber-300/70"
          >
            Thanks for your feedback! We'll improve our virtual try-on technology.
          </motion.p>
        )}

        {feedback === "like" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 text-sm text-amber-700/70 dark:text-amber-300/70"
          >
            Great! We're glad you like it. Don't forget to share your result!
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}


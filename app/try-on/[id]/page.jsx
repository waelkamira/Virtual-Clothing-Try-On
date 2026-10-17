"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, ChevronDown } from "lucide-react"
import Navbar from "../../../components/navbar"
import TryOnInterface from "../../../components/try-on-interface"
import Footer from "../../../components/footer"

// Sample product data
const product = {
  id: 1,
  name: "Classic White T-Shirt",
  brand: "Essentials",
  price: 24.99,
  rating: 4.5,
  reviews: 128,
  description: "A comfortable, versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear.",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["White", "Black", "Gray"],
  images: [
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
  ],
}

export default function ProductTryOnPage({ params }) {
  const [activeView, setActiveView] = useState("front")
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("White")
  const [uploadedImage, setUploadedImage] = useState(null)

  const handlePhotoCapture = (imageUrl) => {
    setUploadedImage(imageUrl)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link
              href="/catalog"
              className="mr-4 p-2 rounded-full bg-primary-900/50 text-gray-300 hover:text-white hover:bg-primary-800/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Virtual Try-On</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <TryOnInterface onPhotoCapture={handlePhotoCapture} />

              {uploadedImage && (
                <div className="mt-6 flex justify-center">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-md bg-primary-900/50 text-accent-400 hover:bg-primary-800/50 transition-colors">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2 rounded-md bg-primary-900/50 text-accent-400 hover:bg-primary-800/50 transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-primary-950/50 backdrop-blur-md border border-primary-800/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-accent-400 font-medium">{product.brand}</span>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white ml-1">{product.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({product.reviews})</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                <p className="text-xl font-bold text-accent-400 mb-4">${product.price}</p>

                <p className="text-gray-400 mb-6">{product.description}</p>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">Size</h3>
                    <button className="text-sm text-accent-400 flex items-center">
                      Size Guide
                      <ChevronDown size={14} className="ml-1" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center text-sm transition-colors ${
                          selectedSize === size
                            ? "bg-accent-400 text-black"
                            : "bg-primary-900/50 text-gray-300 hover:text-white hover:bg-primary-800/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium text-white mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${
                          selectedColor === color
                            ? "bg-accent-400 text-black"
                            : "bg-primary-900/50 text-gray-300 hover:text-white hover:bg-primary-800/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium shadow-lg hover:shadow-primary-500/20 hover:from-primary-500 hover:to-primary-400 transition-all flex items-center justify-center gap-2">
                    <ShoppingBag size={20} />
                    <span>Add to Cart</span>
                  </button>
                  <button className="p-3 rounded-lg bg-primary-900/50 text-gray-300 hover:text-white hover:bg-primary-800/50 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


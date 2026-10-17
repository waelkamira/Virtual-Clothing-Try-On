"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"

export default function DetailPage() {
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("Beige")

  const sizes = ["XS", "S", "M", "L", "XL"]
  const colors = ["Beige", "Black", "Gray", "White"]

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      {/* Top navigation */}
      <div className="flex justify-between items-center p-4">
        <Link href="/">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>

      {/* Main content - product image */}
      <div className="flex-1 relative">
        <Image
          src="/placeholder.svg?height=800&width=400"
          alt="Beige cardigan detail"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Product details */}
      <div className="bg-white rounded-t-3xl p-6">
        <h1 className="text-xl font-medium">Beige Cardigan</h1>
        <p className="text-gray-500 mt-1">Premium Cashmere Blend</p>
        <p className="text-xl font-medium mt-2">$129.99</p>

        {/* Size selection */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Size</p>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedSize === size ? "bg-black text-white" : "bg-[#f0f0f0] text-black"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color selection */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Color</p>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedColor === color ? "bg-black text-white" : "bg-[#f0f0f0] text-black"
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Buy button */}
        <button className="w-full h-12 bg-black text-white rounded-full font-medium mt-6">Add to Cart</button>
      </div>

      {/* Home indicator */}
      <div className="h-1 w-32 bg-black rounded-full mx-auto my-2"></div>
    </div>
  )
}


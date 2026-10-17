"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react"

export default function OutfitView() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const outfits = [
    { id: 1, name: "Camel Coat" },
    { id: 2, name: "Beige Cardigan" },
    { id: 3, name: "Long Cardigan" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      {/* Status bar */}
      <div className="h-10 flex justify-between items-center px-6 bg-[#f5f5f5]">
        <div className="text-sm font-medium">9:41</div>
        <div className="flex items-center gap-1">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 4.5C1 2.567 2.567 1 4.5 1H11.5C13.433 1 15 2.567 15 4.5V7.5C15 9.433 13.433 11 11.5 11H4.5C2.567 11 1 9.433 1 7.5V4.5Z"
              stroke="black"
              strokeWidth="2"
            />
            <path d="M16 4.5H15.5V7.5H16V4.5Z" fill="black" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0C9.6 0 11.1 0.5 12.3 1.4C13.5 2.2 14.4 3.4 14.9 4.8C15 5.1 15 5.4 15 5.7C15 6 15 6.3 14.9 6.6C14.4 8 13.5 9.2 12.3 10C11.1 10.9 9.6 11.4 8 11.4C6.4 11.4 4.9 10.9 3.7 10C2.5 9.2 1.6 8 1.1 6.6C1 6.3 1 6 1 5.7C1 5.4 1 5.1 1.1 4.8C1.6 3.4 2.5 2.2 3.7 1.4C4.9 0.5 6.4 0 8 0ZM8 2.3C6.5 2.3 5.3 3.5 5.3 5C5.3 6.5 6.5 7.7 8 7.7C9.5 7.7 10.7 6.5 10.7 5C10.7 3.5 9.5 2.3 8 2.3ZM8 3.7C8.7 3.7 9.3 4.3 9.3 5C9.3 5.7 8.7 6.3 8 6.3C7.3 6.3 6.7 5.7 6.7 5C6.7 4.3 7.3 3.7 8 3.7Z"
              fill="black"
            />
          </svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="23" height="11" rx="2.5" stroke="black" />
            <rect x="2" y="2" width="18" height="8" rx="1" fill="black" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Link href="/home">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pb-4">
        <div className="relative h-[calc(100vh-10rem)]">
          <Image
            src="/placeholder.svg?height=800&width=400"
            alt={outfits[currentIndex].name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-8 left-0 right-0 px-4">
        {currentIndex === 2 ? (
          <button className="w-full h-14 bg-black text-white rounded-full font-semibold">Buy Now</button>
        ) : (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button key={i} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                {i === 1 && <ShoppingBag className="h-5 w-5" />}
                {i === 2 && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4V16M4 10H16" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {i === 3 && <Heart className="h-5 w-5" />}
                {i === 4 && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 10L5 10M5 10L9 6M5 10L9 14"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="fixed bottom-0 left-0 right-0 h-8 flex justify-center items-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search, ShoppingBag, Camera, User, Heart, Store, Menu, X } from "lucide-react"

export default function MobileView({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { icon: <Home size={24} />, label: "Home", href: "/" },
    { icon: <Search size={24} />, label: "Search", href: "/online-search" },
    { icon: <Store size={24} />, label: "Stores", href: "/stores" },
    { icon: <Camera size={24} />, label: "Try On", href: "/try-on" },
    { icon: <Heart size={24} />, label: "Favorites", href: "/favorites" },
  ]

  return (
    <div className="relative w-full max-w-md mx-auto h-[700px] overflow-hidden rounded-[40px] shadow-2xl border-8 border-[#1a56db] bg-[#f0f4ff]">
      {/* Status Bar */}
      <div className="bg-[#1a56db] text-white px-6 py-2 flex items-center justify-between">
        <div className="text-xs font-medium">9:41</div>
        <div className="flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="white"
            />
            <path
              d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
              fill="white"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.01 21.49L23.64 7C23.8 6.8 23.9 6.6 23.94 6.39C23.98 6.19 23.99 5.99 23.96 5.79C23.92 5.59 23.85 5.4 23.74 5.24C23.63 5.08 23.48 4.95 23.31 4.84C23.14 4.74 22.95 4.67 22.76 4.64C22.57 4.6 22.38 4.61 22.19 4.65C22 4.69 21.82 4.77 21.66 4.88C21.5 4.99 21.36 5.13 21.25 5.3L11 18.08L5.26 12.34C5.1 12.18 4.91 12.06 4.7 11.97C4.49 11.89 4.27 11.85 4.04 11.85C3.82 11.85 3.59 11.89 3.38 11.97C3.17 12.05 2.99 12.17 2.82 12.32C2.66 12.48 2.53 12.67 2.44 12.88C2.36 13.09 2.31 13.31 2.31 13.54C2.31 13.76 2.36 13.98 2.44 14.19C2.53 14.4 2.65 14.59 2.81 14.75L9.75 21.69C9.91 21.85 10.09 21.97 10.3 22.06C10.5 22.14 10.72 22.18 10.94 22.18C11.17 22.18 11.39 22.14 11.59 22.06C11.8 21.97 11.98 21.85 12.13 21.7L12.01 21.49Z"
              fill="white"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.66C7 21.4 7.6 22 8.33 22H15.66C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100%-110px)] overflow-y-auto bg-white">{children}</div>

      {/* Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 flex items-center justify-around px-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center justify-center w-16 h-full text-[#1a56db] hover:text-[#1e429f]"
          >
            <div className="w-6 h-6">{item.icon}</div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}

        <button
          className="flex flex-col items-center justify-center w-16 h-full text-[#1a56db] hover:text-[#1e429f]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-6">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</div>
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>

      {/* Expanded Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute inset-0 bg-white z-10 pt-12 pb-16 px-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#1a56db]">Menu</h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/profile"
              className="flex flex-col items-center p-4 rounded-xl bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={32} className="mb-2" />
              <span>Profile</span>
            </Link>

            <Link
              href="/online-search"
              className="flex flex-col items-center p-4 rounded-xl bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search size={32} className="mb-2" />
              <span>Search Online</span>
            </Link>

            <Link
              href="/website-search"
              className="flex flex-col items-center p-4 rounded-xl bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={32} className="mb-2" />
              <span>Our Collection</span>
            </Link>

            <Link
              href="/stores"
              className="flex flex-col items-center p-4 rounded-xl bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <Store size={32} className="mb-2" />
              <span>Stores</span>
            </Link>

            <Link
              href="/favorites"
              className="flex flex-col items-center p-4 rounded-xl bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={32} className="mb-2" />
              <span>Favorites</span>
            </Link>

            <Link
              href="/try-on"
              className="flex flex-col items-center p-4 rounded-xl bg-[#f0f4ff] text-[#1a56db]"
              onClick={() => setIsMenuOpen(false)}
            >
              <Camera size={32} className="mb-2" />
              <span>Try On</span>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f0f4ff] text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Help & Support
              </Link>

              <Link
                href="/privacy"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f0f4ff] text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy Policy
              </Link>

              <Link
                href="/faq"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f0f4ff] text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}


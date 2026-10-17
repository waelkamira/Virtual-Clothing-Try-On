"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Camera, User, Menu, X } from "lucide-react"

export default function TopNavbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: "/", icon: <Home className="h-5 w-5" />, label: "Home" },
    { path: "/online-search", icon: <Search className="h-5 w-5" />, label: "Search" },
    { path: "/stores", icon: <ShoppingBag className="h-5 w-5" />, label: "Stores" },
    { path: "/mobile-view", icon: <Camera className="h-5 w-5" />, label: "Try-On" },
    { path: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
  ]

  return (
    <>
      {/* Desktop navbar */}
      <div className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-3 px-6 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-[#B38867]">VF</span>
            <span className="ml-2 text-sm text-[#FF9B50] font-medium">VIRTUAL FIT</span>
          </Link>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center ${
                  pathname === item.path ? "text-[#B38867] font-medium" : "text-gray-500 hover:text-[#B38867]"
                } transition-colors`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-3 px-4 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-[#B38867]">VF</span>
            <span className="ml-2 text-sm text-[#FF9B50] font-medium">VIRTUAL FIT</span>
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center p-4 ${
                  pathname === item.path ? "text-[#B38867] bg-gray-50" : "text-gray-500"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="h-14 md:h-16"></div>
    </>
  )
}


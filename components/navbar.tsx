"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Camera, User } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="fixed top-[5.75rem] left-1/2 z-[60] w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white/95 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl" aria-label="Primary navigation">
      <div className="flex justify-around items-center">
        <Link href="/" className={`flex flex-col items-center ${isActive("/") ? "text-[#B38867]" : "text-gray-500"}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/online-search"
          className={`flex flex-col items-center ${isActive("/online-search") ? "text-[#B38867]" : "text-gray-500"}`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>

        <Link
          href="/stores"
          className={`flex flex-col items-center ${isActive("/stores") ? "text-[#B38867]" : "text-gray-500"}`}
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xs mt-1">Stores</span>
        </Link>

        <Link
          href="/mobile-view"
          className={`flex flex-col items-center ${isActive("/mobile-view") ? "text-[#B38867]" : "text-gray-500"}`}
        >
          <Camera className="h-6 w-6" />
          <span className="text-xs mt-1">Try-On</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center ${isActive("/profile") ? "text-[#B38867]" : "text-gray-500"}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  )
}


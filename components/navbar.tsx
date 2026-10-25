"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Camera, Heart, User } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/catalog", icon: ShoppingBag, label: "Catalog" },
    { href: "/try-on", icon: Camera, label: "Try-On" },
    { href: "/favorites", icon: Heart, label: "Saved" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 py-2 px-2 z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
      aria-label="Primary navigation"
    >
      <div className="flex justify-around items-center max-w-3xl mx-auto">
        {items.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center min-w-[52px] ${isActive(href) ? "text-[#B38867]" : "text-gray-500"}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

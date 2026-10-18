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
    <nav
      className="fixed inset-x-0 top-4 z-[70] px-4 sm:px-6"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/70 bg-white/90 px-4 py-2 shadow-[0_10px_35px_rgba(120,75,30,0.14)] backdrop-blur-xl sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-orange-500 sm:text-xl">
          VirtualFit
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          {[
            { href: "/", icon: Home, label: "Home" },
            { href: "/search", icon: Search, label: "Search" },
            { href: "/stores", icon: ShoppingBag, label: "Stores" },
            { href: "/mobile-view", icon: Camera, label: "Try-On" },
            { href: "/profile", icon: User, label: "Profile" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex items-center gap-2 rounded-full px-2.5 py-2 text-sm transition-colors sm:px-3 ${
                isActive(href) ? "bg-orange-100 text-orange-600" : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}


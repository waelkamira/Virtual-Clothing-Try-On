"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, ShoppingBag, User, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function GlassNavbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/stores", icon: ShoppingBag, label: "Stores" },
    { href: "/upload", icon: User, label: "Try On" },
  ]

  return (
    <header className="fixed top-[6.75rem] left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20 rounded-full shadow-lg px-4 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text">
                VirtualFit
              </span>
            </Link>

            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative rounded-full px-3 py-1.5 text-sm transition-all ${
                        isActive
                          ? "text-amber-900 dark:text-amber-300"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-amber-100 dark:bg-amber-900/40 rounded-full z-[-1]"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                )
              })}

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}


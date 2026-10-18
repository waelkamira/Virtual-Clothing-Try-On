import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/contexts/store-context"
import { UserProvider } from "@/contexts/user-context"
import { Toaster } from "@/components/ui/toaster"
import GlassNavbar from "@/components/glass-navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Virtual Clothing Try-On",
  description: "Try on clothes virtually before you buy them",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 min-h-screen`}
      >
        <div className="fixed inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        <div className="fixed inset-0 -z-10 bg-gradient-radial from-transparent to-amber-500/20 dark:to-amber-900/30"></div>

        <ThemeProvider attribute="class" defaultTheme="light">
          <StoreProvider>
            <UserProvider>
              <GlassNavbar />
              <main className="pt-36 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">{children}</main>
              <Toaster />
            </UserProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WebView from "@/components/web-view"
import { useStore } from "@/contexts/store-context"
import { useToast } from "@/components/ui/use-toast"

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const { openInWebView, closeWebView, extractProductsFromWebView, webViewUrl } = useStore()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)

    // Get URL from query params
    const url = searchParams.get("url")
    if (url) {
      openInWebView(url)
    }
  }, [searchParams, openInWebView])

  // Handle extraction
  const handleExtractProducts = async () => {
    try {
      await extractProductsFromWebView()
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract products. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8">Loading browser...</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If no URL is provided, show a form to enter one
  if (!webViewUrl) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Link
                href="/"
                className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold">In-App Browser</h1>
            </div>

            <div className="max-w-md mx-auto bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Enter a URL to browse</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const url = new FormData(form).get("url") as string
                  if (url) {
                    openInWebView(url)
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="url" className="block text-sm font-medium mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    placeholder="https://example.com"
                    required
                    className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium"
                >
                  Browse Website
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show WebView
  return <WebView url={webViewUrl} onClose={closeWebView} onExtractProducts={handleExtractProducts} />
}


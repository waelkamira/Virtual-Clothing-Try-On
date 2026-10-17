"use client"

import { useState, useEffect, useRef } from "react"
import { X, ArrowLeft, ArrowRight, RefreshCw, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface WebViewProps {
  url: string
  onClose: () => void
  onExtractProducts: () => Promise<void>
}

export default function WebView({ url, onClose, onExtractProducts }: WebViewProps) {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [isLoading, setIsLoading] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [title, setTitle] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { toast } = useToast()

  // Initialize the WebView
  useEffect(() => {
    setCurrentUrl(url)
    setIsLoading(true)
  }, [url])

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)

    // In a real implementation, we would use the iframe's contentWindow to get navigation state
    // However, due to cross-origin restrictions, this is often limited
    // For demonstration purposes, we'll simulate this behavior
    setCanGoBack(Math.random() > 0.3) // Simulate random back state
    setCanGoForward(Math.random() > 0.7) // Simulate random forward state

    // Try to get the title (may fail due to cross-origin restrictions)
    try {
      if (iframeRef.current?.contentDocument?.title) {
        setTitle(iframeRef.current.contentDocument.title)
      } else {
        // Extract domain from URL as fallback title
        const domain = new URL(currentUrl).hostname.replace("www.", "")
        setTitle(domain)
      }
    } catch (error) {
      // If we can't access the contentDocument due to cross-origin restrictions
      const domain = new URL(currentUrl).hostname.replace("www.", "")
      setTitle(domain)
    }
  }

  // Navigation functions
  const goBack = () => {
    if (iframeRef.current) {
      // In a real implementation, we would use iframe.contentWindow.history.back()
      // For demonstration, we'll just show a toast
      toast({
        title: "Navigation",
        description: "Going back...",
      })
    }
  }

  const goForward = () => {
    if (iframeRef.current) {
      // In a real implementation, we would use iframe.contentWindow.history.forward()
      // For demonstration, we'll just show a toast
      toast({
        title: "Navigation",
        description: "Going forward...",
      })
    }
  }

  const refresh = () => {
    if (iframeRef.current) {
      // In a real implementation, we would use iframe.contentWindow.location.reload()
      // For demonstration, we'll just reload the iframe
      const iframe = iframeRef.current
      iframe.src = iframe.src
      setIsLoading(true)
    }
  }

  // Handle product extraction
  const handleExtractProducts = async () => {
    setIsLoading(true)
    try {
      await onExtractProducts()
      toast({
        title: "Success",
        description: "Products extracted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goBack} disabled={!canGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goForward} disabled={!canGoForward}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={refresh}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 mx-4">
          <div className="bg-background/50 border border-input rounded-md px-3 py-1 text-sm truncate">{currentUrl}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast({
                title: "Share",
                description: "Sharing functionality coming soon!",
              })
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="default" onClick={handleExtractProducts} disabled={isLoading}>
            <Download className="h-5 w-5 mr-2" />
            {isLoading ? "Extracting..." : "Extract Products"}
          </Button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {/* WebView content */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  )
}


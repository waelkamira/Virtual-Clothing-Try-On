"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Share2, Heart, Download, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { imageProcessor, type ProcessedImage, type ViewType } from "@/lib/image-processing"
import { useStore } from "@/contexts/store-context"

interface EnhancedTryOnProps {
  onPhotoCapture?: (imageUrl: string | null) => void
}

export default function EnhancedTryOn({ onPhotoCapture }: EnhancedTryOnProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeView, setActiveView] = useState<ViewType>("front")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [bodyMeasurements, setBodyMeasurements] = useState<Record<string, number> | null>(null)
  const [recommendedSizes, setRecommendedSizes] = useState<Record<string, string>>({})

  const { selectedItems } = useStore()
  const { toast } = useToast()

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await fetch("/api/upload", { method: "POST", body: formData })
        if (!response.ok) throw new Error("Upload failed")
        const { url: imageUrl } = await response.json()
        setUploadedImage(imageUrl)
        setIsUploading(false)
        if (onPhotoCapture) onPhotoCapture(imageUrl)

        // Extract body measurements
        try {
          const measurements = await imageProcessor.extractBodyMeasurements(imageUrl)
          setBodyMeasurements(measurements)

          // Generate size recommendations for all selected items
          const sizes: Record<string, string> = {}
          selectedItems.forEach((item) => {
            sizes[item.id] = imageProcessor.recommendSize(measurements, item.category)
          })
          setRecommendedSizes(sizes)

          toast({
            title: "Measurements extracted",
            description: "We've analyzed your photo and extracted your measurements for accurate sizing.",
          })
        } catch (error) {
          console.error("Failed to extract measurements:", error)
        }
      } catch (error) {
        console.error("[v0] Upload failed", error)
        setIsUploading(false)
        toast({ title: "Upload failed", description: "Please choose a JPG, PNG, or WebP image under 10MB.", variant: "destructive" })
      }
    }
  }

  // Process try-on for a specific item
  const processItem = async (index: number) => {
    if (!uploadedImage || index >= selectedItems.length) return

    setIsProcessing(true)
    setProcessProgress(0)
    setSelectedItemIndex(index)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 100)

    try {
      // Generate all views for the selected item
      const item = selectedItems[index]
      const results = await imageProcessor.generateAllViews(uploadedImage, {
        id: item.id,
        image: item.image,
        category: item.category,
        color: item.color,
        size: item.size,
      })

      setProcessedImages(results)
      setActiveView("front") // Reset to front view

      // Update progress to 100%
      clearInterval(progressInterval)
      setProcessProgress(100)

      toast({
        title: "Try-on complete",
        description: "Your virtual try-on is ready! Use the view controls to see different angles.",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your try-on. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 500) // Short delay to ensure progress bar reaches 100%
    }
  }

  // Navigate between views
  const navigateView = (direction: "prev" | "next") => {
    const views: ViewType[] = ["front", "side", "back"]
    const currentIndex = views.indexOf(activeView)

    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % views.length
      setActiveView(views[nextIndex])
    } else {
      const prevIndex = (currentIndex - 1 + views.length) % views.length
      setActiveView(views[prevIndex])
    }
  }

  // Download the current view
  const downloadImage = () => {
    if (processedImages.length === 0) return

    const currentImage = processedImages.find((img) => img.viewType === activeView)
    if (!currentImage) return

    const link = document.createElement("a")
    link.href = currentImage.url
    link.download = `virtual-try-on-${activeView}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Image downloaded",
      description: `Your ${activeView} view has been downloaded.`,
    })
  }

  // Share the current view
  const shareImage = () => {
    if (processedImages.length === 0) return

    // In a real app, this would use the Web Share API or a custom sharing dialog
    toast({
      title: "Sharing",
      description: "Opening share dialog...",
    })

    // For demo purposes, we'll just simulate a successful share
    setTimeout(() => {
      toast({
        title: "Shared successfully",
        description: "Your virtual try-on image has been shared.",
      })
    }, 1500)
  }

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl overflow-hidden">
      {/* Header with view selector */}
      {processedImages.length > 0 && (
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-medium">Virtual Try-On</h3>
          <div className="flex bg-background/50 border border-border rounded-lg p-1">
            {(["front", "side", "back"] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  activeView === view ? "bg-orange-500 text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="relative aspect-square w-full">
        {/* Background grid effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "-1px -1px",
            perspective: "1000px",
            transform: "rotateX(60deg)",
          }}
        ></div>

        {/* Processed images */}
        <AnimatePresence mode="wait">
          {processedImages.length > 0 && (
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="relative h-full w-full">
                {/* Current view image */}
                <Image
                  src={processedImages.find((img) => img.viewType === activeView)?.url || "/placeholder.svg"}
                  alt={`Virtual try-on ${activeView} view`}
                  fill
                  className="object-contain"
                />

                {/* Navigation arrows */}
                <button
                  onClick={() => navigateView("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => navigateView("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>

                {/* View indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {(["front", "side", "back"] as ViewType[]).map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`w-2 h-2 rounded-full ${
                        activeView === view ? "bg-orange-500" : "bg-white/50 hover:bg-white/80"
                      }`}
                    ></button>
                  ))}
                </div>

                {/* Store logo */}
                {selectedItemIndex !== null && (
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg p-1 shadow-lg">
                    <Image
                      src={selectedItems[selectedItemIndex].storeLogo || "/placeholder.svg"}
                      alt={selectedItems[selectedItemIndex].brand}
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploaded image or placeholder */}
        {uploadedImage && processedImages.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Image src={uploadedImage || "/placeholder.svg"} alt="Uploaded photo" fill className="object-contain" />

            {/* Reset button */}
            <button
              onClick={() => {
                setUploadedImage(null)
                setProcessedImages([])
                setSelectedItemIndex(null)
                if (onPhotoCapture) onPhotoCapture(null)
              }}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload prompt */}
        {!uploadedImage && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 mb-4">
              <Camera size={40} className="text-orange-500" />
            </div>
            <p className="text-center text-muted-foreground mb-4 max-w-xs">
              Upload a photo or take a picture to create your virtual model
            </p>
            <Button
              onClick={() => document.getElementById("photo-upload")?.click()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Camera className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        )}

        {/* Selected items thumbnails */}
        {uploadedImage && selectedItems.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {selectedItems.map((item, index) => (
              <div
                key={item.id}
                className={`w-14 h-14 rounded-md overflow-hidden cursor-pointer transition-all ${
                  selectedItemIndex === index
                    ? "ring-2 ring-orange-500 scale-110"
                    : "bg-black/30 backdrop-blur-sm border border-white/20"
                }`}
                onClick={() => processItem(index)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name || `Item ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Recommended size badge */}
                  {recommendedSizes[item.id] && (
                    <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[10px] px-1 rounded-tl-md">
                      {recommendedSizes[item.id]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm z-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <div className="mt-4 w-full max-w-xs">
              <div className="text-xs text-center mb-1 text-muted-foreground">{Math.round(processProgress)}%</div>
              <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${processProgress}%` }}
                ></div>
              </div>
            </div>
            <p className="mt-4 text-foreground">Processing your virtual try-on...</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {processedImages.length > 0 && (
        <div className="p-4 border-t border-border flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
              onClick={shareImage}
            >
              <Share2 size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
              onClick={() => {
                toast({
                  title: "Added to favorites",
                  description: "This outfit has been added to your favorites.",
                })
              }}
            >
              <Heart size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
              onClick={downloadImage}
            >
              <Download size={18} />
            </Button>
          </div>

          <div>
            <Button
              variant="default"
              size="sm"
              className="px-3 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => {
                setProcessedImages([])
                setSelectedItemIndex(null)
              }}
            >
              Try Another Item
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


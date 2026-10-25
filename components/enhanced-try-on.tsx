"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Share2, Heart, Download, Bookmark, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { imageProcessor, type ProcessedImage, type ViewType } from "@/lib/image-processing"
import { useStore } from "@/contexts/store-context"
import { useUser } from "@/contexts/user-context"

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

  const { selectedItems, userPhotoUrl, setUserPhotoUrl, toggleFavorite, isFavorite } = useStore()
  const { saveOutfit } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (!uploadedImage && userPhotoUrl) {
      setUploadedImage(userPhotoUrl)
      onPhotoCapture?.(userPhotoUrl)
    }
  }, [uploadedImage, userPhotoUrl, onPhotoCapture])

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
        setUserPhotoUrl(imageUrl)
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
      // Generate the front view for the selected item
      const item = selectedItems[index]
      const front = await imageProcessor.generateView(uploadedImage, {
        id: item.id,
        image: item.image,
        category: item.category,
        name: item.name,
        color: item.color,
        size: item.size,
      }, "front")

      setProcessedImages([front])
      setActiveView("front")

      // Update progress to 100%
      clearInterval(progressInterval)
      setProcessProgress(100)

      toast({
        title: "Try-on complete",
        description: "Your front-view virtual try-on is ready.",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "There was an error processing your try-on.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 500) // Short delay to ensure progress bar reaches 100%
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

  const saveCurrentOutfit = async () => {
    const currentImage = processedImages.find((img) => img.viewType === activeView) || processedImages[0]
    if (!currentImage) return
    const item = selectedItemIndex !== null ? selectedItems[selectedItemIndex] : selectedItems[0]
    await saveOutfit({
      name: item ? `${item.name} look` : "Saved look",
      image: currentImage.url,
      items: selectedItems.map((selected) => selected.id),
    })
    toast({
      title: "Outfit saved",
      description: "You can find it on your profile.",
    })
  }

  const shareImage = async () => {
    const currentImage = processedImages.find((img) => img.viewType === activeView)
    if (!currentImage) return
    try {
      if (navigator.share) {
        await navigator.share({ title: "My VirtualFit look", url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
      toast({ title: "Shared", description: "Your try-on link is ready to send." })
    } catch {
      toast({ title: "Share canceled" })
    }
  }

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl overflow-hidden">
      <p className="border-b border-border px-4 py-3 text-xs text-muted-foreground">
        Try-on sends your photo and the garment image to the{" "}
        <a
          href="https://huggingface.co/spaces/yisol/IDM-VTON"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          free public IDM-VTON demo
        </a>
        . It may be queued or unavailable, and its model is licensed for non-commercial use only.
      </p>
      {processedImages.length > 0 && (
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-medium">Virtual Try-On</h3>
          <span className="text-xs text-muted-foreground">Front view only</span>
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
                setUserPhotoUrl(null)
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
              <input id="photo-upload" type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} />
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
                const item = selectedItemIndex !== null ? selectedItems[selectedItemIndex] : selectedItems[0]
                if (!item) return
                toggleFavorite(item)
                toast({
                  title: isFavorite(item.id) ? "Removed from favorites" : "Added to favorites",
                  description: item.name,
                })
              }}
            >
              <Heart size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
              onClick={() => void saveCurrentOutfit()}
              aria-label="Save outfit"
            >
              <Bookmark size={18} />
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

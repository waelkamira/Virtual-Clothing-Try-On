"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, RotateCw, Shirt, Share2, Heart, Download, X, Palette } from "lucide-react"
import { Loading } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { useToast } from "@/components/ui/use-toast"

interface TryOnInterfaceProps {
  onPhotoCapture?: (imageUrl: string | null) => void
  selectedItems?: any[]
}

export default function TryOnInterface({ onPhotoCapture, selectedItems = [] }: TryOnInterfaceProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeView, setActiveView] = useState<"front" | "side" | "back">("front")
  const [showControls, setShowControls] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { extractColorsFromUploadedImage, applyExtractedColors, resetTheme } = useTheme()
  const { toast } = useToast()

  // Reset processing state when selected items change
  useEffect(() => {
    if (selectedItems.length === 0) {
      setProcessedImage(null)
      setSelectedItemIndex(null)
    }
  }, [selectedItems])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string
        setUploadedImage(imageUrl)
        setIsUploading(false)
        if (onPhotoCapture) onPhotoCapture(imageUrl)

        // Extract colors from the uploaded image
        try {
          await extractColorsFromUploadedImage(imageUrl)
          toast({
            title: "Colors extracted",
            description: "We've extracted colors from your image to personalize the interface.",
          })
        } catch (error) {
          console.error("Failed to extract colors:", error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // In a real app, this would access the device camera
    // For this prototype, we'll trigger the file input
    fileInputRef.current?.click()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetImage = () => {
    setUploadedImage(null)
    setProcessedImage(null)
    setSelectedItemIndex(null)
    if (onPhotoCapture) onPhotoCapture(null)
    resetTheme()
  }

  const applyTheme = () => {
    applyExtractedColors()
    toast({
      title: "Theme applied",
      description: "The interface colors have been updated based on your image.",
    })
  }

  const tryOnItem = (index: number) => {
    if (!uploadedImage) return

    setIsProcessing(true)
    setProcessProgress(0)
    setSelectedItemIndex(index)

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // In a real app, this would be the result from the AI processing
          setProcessedImage(uploadedImage)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const downloadImage = () => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = "virtual-try-on.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Image downloaded",
      description: "Your virtual try-on image has been downloaded.",
    })
  }

  const shareImage = () => {
    if (!processedImage) return

    // In a real app, this would open a share dialog
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="try-on-interface rounded-xl overflow-hidden bg-card/50 border border-border relative"
    >
      {/* View selector */}
      {uploadedImage && (
        <div className="absolute top-4 right-4 z-30 flex bg-background/40 backdrop-blur-md rounded-lg border border-border p-1">
          {["front", "side", "back"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as "front" | "side" | "back")}
              className={`px-3 py-1 text-xs font-medium rounded ${
                activeView === view ? "bg-orange-500 text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="absolute top-4 left-4 z-30">
        <div className="text-3xl font-bold">VF</div>
        <div className="text-sm font-medium text-orange-500">
          {uploadedImage ? `${activeView.toUpperCase()} VIEW` : "VIRTUAL TRY-ON"}
        </div>
      </div>

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

        {/* Uploaded image or processed image */}
        <AnimatePresence>
          {(uploadedImage || processedImage) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
            >
              <Image
                src={processedImage || uploadedImage || "/placeholder.svg"}
                alt="Uploaded photo"
                fill
                className="object-contain"
              />

              {/* Reset button */}
              <button
                onClick={resetImage}
                className="absolute top-4 left-20 z-40 p-2 bg-background/40 backdrop-blur-md rounded-full border border-border text-foreground hover:bg-background/60 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Apply theme button */}
              <button
                onClick={applyTheme}
                className="absolute top-4 left-32 z-40 p-2 bg-background/40 backdrop-blur-md rounded-full border border-border text-foreground hover:bg-background/60 transition-colors"
                title="Apply colors from image to theme"
              >
                <Palette size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center camera button */}
        {!uploadedImage && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={triggerFileInput}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 z-20 hover:bg-orange-500/30 transition-all"
          >
            <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
            <Camera size={40} className="text-orange-500" />
          </motion.button>
        )}

        {/* Side control buttons */}
        <AnimatePresence>
          {showControls && uploadedImage && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3, staggerChildren: 0.1 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20"
            >
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={triggerFileInput}
                className="w-10 h-10 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center hover:bg-orange-500/30 transition-all"
              >
                <Camera size={18} className="text-orange-500" />
              </motion.button>
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-10 h-10 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center hover:bg-orange-500/30 transition-all"
              >
                <RotateCw size={18} className="text-orange-500" />
              </motion.button>
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleCameraCapture}
                className="w-10 h-10 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center hover:bg-orange-500/30 transition-all"
              >
                <Shirt size={18} className="text-orange-500" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected items thumbnails */}
        <AnimatePresence>
          {uploadedImage && selectedItems.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"
            >
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  className={`w-14 h-14 rounded-md overflow-hidden cursor-pointer transition-all ${
                    selectedItemIndex === index
                      ? "ring-2 ring-orange-500 scale-110"
                      : "bg-orange-500/20 backdrop-blur-md border border-orange-500/30"
                  }`}
                  onClick={() => tryOnItem(index)}
                >
                  {item.image ? (
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name || `Item ${index + 1}`}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                      <Shirt size={24} className="text-orange-500/70" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Platform glow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[70%] h-[1px] bg-orange-500/70 rounded-full z-10 shadow-[0_0_10px_3px_rgba(249,115,22,0.5)]"></div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {/* Loading indicator */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-30">
            <Loading size="lg" />
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm z-30">
            <Loading size="lg" showProgress progress={processProgress} />
            <p className="mt-4 text-foreground">Processing your virtual try-on...</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {uploadedImage && (
        <div className="p-3 flex justify-between bg-background/40 backdrop-blur-md border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
              onClick={shareImage}
              disabled={!processedImage}
            >
              <Share2 size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
            >
              <Heart size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30"
              onClick={downloadImage}
              disabled={!processedImage}
            >
              <Download size={18} />
            </Button>
          </div>

          {selectedItems.length > 0 ? (
            <Button
              variant="default"
              size="sm"
              className="px-3 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => {
                if (selectedItemIndex !== null) {
                  tryOnItem(selectedItemIndex)
                } else if (selectedItems.length > 0) {
                  tryOnItem(0)
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : processedImage ? "Try Another" : "Try On Selected"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="px-3 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => {
                toast({
                  title: "No items selected",
                  description: "Please select items from the catalog to try on.",
                })
              }}
            >
              Select Items
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}


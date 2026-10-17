"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, ImageIcon, Sparkles, X, Check, RefreshCw } from "lucide-react"

interface GlassPhotoUploadProps {
  onPhotoUpload: (file: File) => void
  className?: string
}

export function GlassPhotoUpload({ onPhotoUpload, className = "" }: GlassPhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showControls, setShowControls] = useState(true)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        onPhotoUpload(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const resetImage = () => {
    setPreviewUrl(null)
  }

  return (
    <div className={`relative w-full max-w-md aspect-[3/4] ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full h-full overflow-hidden relative"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/30 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-xl">VF</div>
              <div className="text-amber-400 text-xs font-medium tracking-wider">VIRTUAL TRY-ON</div>
            </div>

            {previewUrl && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetImage}
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="w-full h-full flex items-center justify-center">
          {previewUrl ? (
            <div className="relative w-full h-full">
              <Image src={previewUrl || "/placeholder.svg"} alt="Uploaded photo" fill className="object-cover" />

              {/* Floating controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg"
                      onClick={resetImage}
                    >
                      <RefreshCw className="h-5 w-5 text-white" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg"
                      onClick={() => setShowControls(false)}
                    >
                      <Check className="h-8 w-8 text-white" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg"
                      onClick={triggerFileInput}
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle controls button */}
              {!showControls && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
                  onClick={() => setShowControls(true)}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-32 h-32 rounded-full bg-amber-500/20 backdrop-blur-md flex items-center justify-center mb-6 cursor-pointer animate-pulse-glow"
                onClick={triggerFileInput}
              >
                <Camera className="h-16 w-16 text-amber-500" />
              </motion.div>

              <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2">Upload Your Photo</h3>
              <p className="text-amber-700/70 dark:text-amber-300/70 max-w-xs mb-8">
                Take or upload a photo to see how clothes will look on you
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-md"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-amber-800 dark:text-amber-200 text-sm">Take Photo</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-md"
                  onClick={triggerFileInput}
                >
                  <ImageIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-amber-800 dark:text-amber-200 text-sm">Browse Gallery</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2 shadow-md"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-amber-800 dark:text-amber-200 text-sm">Upload File</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, Check, Upload, RefreshCw, Sparkles } from "lucide-react"

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void
  className?: string
}

export function PhotoUpload({ onPhotoUpload, className = "" }: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pulseEffect, setPulseEffect] = useState(false)

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

  // Animation effect for the center button
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`w-full max-w-[320px] h-[600px] bg-gradient-to-b from-[#E5D6CC] to-[#D9C7BC] rounded-3xl overflow-hidden relative border-4 border-[#333] shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#B38867] to-[#A37857]">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">VF</div>
          <div className="ml-2 text-[#FF9B50] text-sm font-medium tracking-wider">VIRTUAL TRY-ON</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-[calc(100%-64px)] relative">
        {previewUrl ? (
          <div className="relative w-full h-full">
            <Image src={previewUrl || "/placeholder.svg"} alt="Uploaded photo" fill className="object-cover" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                onClick={triggerFileInput}
                className="bg-[#B38867] text-white p-3 rounded-full shadow-lg hover:bg-[#A37857] transition-all transform hover:scale-105 active:scale-95"
              >
                <Camera className="h-6 w-6" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Center camera button with pulse effect */}
            <button
              onClick={triggerFileInput}
              onMouseEnter={() => setIsHovering(0)}
              onMouseLeave={() => setIsHovering(null)}
              className={`w-24 h-24 rounded-full bg-[#B38867]/70 flex items-center justify-center mb-4 
                transition-all transform hover:scale-110 active:scale-95 relative
                ${pulseEffect ? "shadow-[0_0_15px_rgba(255,155,80,0.7)]" : "shadow-lg"}`}
            >
              <Camera className="h-12 w-12 text-[#FF9B50]" />
              {isHovering === 0 && (
                <div className="absolute -top-10 bg-black/80 text-white text-xs py-1 px-3 rounded-full">
                  Upload Photo
                </div>
              )}
              <div
                className={`absolute inset-0 rounded-full border-2 border-[#FF9B50] 
                ${pulseEffect ? "scale-110 opacity-0" : "scale-100 opacity-100"} 
                transition-all duration-1000`}
              ></div>
            </button>
            <p className="text-[#B38867] text-sm font-medium">Tap to upload your photo</p>

            {/* Side buttons - ALL trigger file upload */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
              <button
                onClick={triggerFileInput}
                onMouseEnter={() => setIsHovering(1)}
                onMouseLeave={() => setIsHovering(null)}
                className="w-12 h-12 rounded-full bg-[#B38867] flex items-center justify-center shadow-md hover:bg-[#A37857] transition-all transform hover:scale-110 active:scale-95 relative"
              >
                <Camera className="h-6 w-6 text-white" />
                {isHovering === 1 && (
                  <div className="absolute -left-28 bg-black/80 text-white text-xs py-1 px-3 rounded-full whitespace-nowrap">
                    Take Photo
                  </div>
                )}
              </button>
              <button
                onClick={triggerFileInput}
                onMouseEnter={() => setIsHovering(2)}
                onMouseLeave={() => setIsHovering(null)}
                className="w-12 h-12 rounded-full bg-[#B38867] flex items-center justify-center shadow-md hover:bg-[#A37857] transition-all transform hover:scale-110 active:scale-95 relative"
              >
                <Check className="h-6 w-6 text-white" />
                {isHovering === 2 && (
                  <div className="absolute -left-28 bg-black/80 text-white text-xs py-1 px-3 rounded-full whitespace-nowrap">
                    Select Photo
                  </div>
                )}
              </button>
              <button
                onClick={triggerFileInput}
                onMouseEnter={() => setIsHovering(3)}
                onMouseLeave={() => setIsHovering(null)}
                className="w-12 h-12 rounded-full bg-[#B38867] flex items-center justify-center shadow-md hover:bg-[#A37857] transition-all transform hover:scale-110 active:scale-95 relative"
              >
                <Upload className="h-6 w-6 text-white" />
                {isHovering === 3 && (
                  <div className="absolute -left-28 bg-black/80 text-white text-xs py-1 px-3 rounded-full whitespace-nowrap">
                    Upload Photo
                  </div>
                )}
              </button>
            </div>

            {/* Bottom thumbnails - also trigger file upload */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {[
                { icon: <Camera className="h-5 w-5 text-[#FF9B50]" />, label: "Camera" },
                { icon: <RefreshCw className="h-5 w-5 text-[#FF9B50]" />, label: "Recent" },
                { icon: <Sparkles className="h-5 w-5 text-[#FF9B50]" />, label: "Effects" },
                { icon: <Upload className="h-5 w-5 text-[#FF9B50]" />, label: "Gallery" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={triggerFileInput}
                  onMouseEnter={() => setIsHovering(4 + i)}
                  onMouseLeave={() => setIsHovering(null)}
                  className="w-16 h-16 rounded-lg bg-[#B38867] shadow-md hover:bg-[#A37857] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative"
                >
                  {item.icon}
                  {isHovering === 4 + i && (
                    <div className="absolute -top-8 bg-black/80 text-white text-xs py-1 px-2 rounded-full whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}


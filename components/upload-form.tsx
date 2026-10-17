"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would upload the file to your server here
    // const formData = new FormData()
    // formData.append('photo', file)
    // await fetch('/api/upload', { method: 'POST', body: formData })

    setIsUploading(false)
    router.push("/mobile-view")
  }

  return (
    <Card className="max-w-md mx-auto backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20 shadow-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
              {preview ? (
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click or drag photo to upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Gallery
              </Button>
              <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              <Button
                type="button"
                variant="outline"
                className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                onClick={() => {
                  // In a real app, you would access the camera here
                  alert("Camera functionality would open here")
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </Button>
            </div>
          </div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              disabled={!file || isUploading}
            >
              {isUploading ? "Uploading..." : "Continue"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}


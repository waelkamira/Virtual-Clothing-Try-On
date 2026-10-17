"use client"

import { useState } from "react"
import Link from "next/link"
import TryOnInterface from "./try-on-interface"

export default function UploadContainer() {
  const [uploadedImage, setUploadedImage] = useState(null)

  const handlePhotoCapture = (imageUrl) => {
    setUploadedImage(imageUrl)
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border border-orange-500/20 rounded-lg overflow-hidden p-6">
      <p className="text-gray-400 mb-6">Take a photo or upload an existing one to create your virtual model.</p>

      <TryOnInterface onPhotoCapture={handlePhotoCapture} />

      {uploadedImage && (
        <div className="mt-6 flex justify-end">
          <Link
            href="/try-on"
            className="inline-flex items-center justify-center px-4 py-2 bg-orange-600/90 hover:bg-orange-500/90 text-white border border-orange-500/50 rounded-md transition-colors"
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}


"use client"

import { useState } from "react"
import TryOnInterface from "./try-on-interface"

export default function TryOnContainer() {
  const [capturedImage, setCapturedImage] = useState(null)

  const handlePhotoCapture = (imageUrl) => {
    setCapturedImage(imageUrl)
    console.log("Photo captured:", imageUrl)
  }

  return (
    <div className="relative z-10 mx-auto max-w-sm">
      <TryOnInterface onPhotoCapture={handlePhotoCapture} />
    </div>
  )
}


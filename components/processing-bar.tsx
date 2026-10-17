"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProcessingBarProps {
  isProcessing: boolean
  onComplete: () => void
  message?: string
  duration?: number
}

export function ProcessingBar({
  isProcessing,
  onComplete,
  message = "Processing...",
  duration = 3000,
}: ProcessingBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete()
          }, 500) // Small delay before completion
          return 100
        }
        return prev + 1
      })
    }, duration / 100)

    return () => clearInterval(interval)
  }, [isProcessing, duration, onComplete])

  if (!isProcessing) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl border border-[#B38867]/20">
        <div className="flex items-center mb-4">
          <Loader2 className="h-5 w-5 text-[#B38867] animate-spin mr-2" />
          <h3 className="text-lg font-medium text-gray-900">{message}</h3>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#B38867] to-[#FF9B50] h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Please wait...</span>
          <span className="text-sm font-medium text-[#B38867]">{progress}%</span>
        </div>
      </div>
    </div>
  )
}


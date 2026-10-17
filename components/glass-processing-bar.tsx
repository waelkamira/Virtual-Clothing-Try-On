"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface GlassProcessingBarProps {
  isProcessing: boolean
  onComplete: () => void
  message?: string
  duration?: number
}

export function GlassProcessingBar({
  isProcessing,
  onComplete,
  message = "Processing",
  duration = 3000,
}: GlassProcessingBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isProcessing) {
      setProgress(0)

      const interval = setInterval(() => {
        setProgress((prev) => {
          // Accelerate progress as it gets closer to 100%
          const increment = prev < 50 ? 1 : prev < 80 ? 0.7 : 0.3
          const newProgress = Math.min(prev + increment, 99.9)
          return newProgress
        })
      }, duration / 100)

      const timer = setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setTimeout(onComplete, 300) // Small delay before calling onComplete
      }, duration)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    } else {
      setProgress(0)
    }
  }, [isProcessing, duration, onComplete])

  if (!isProcessing && progress === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="glass-card p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-amber-500/20">
            <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-200">{message}</h3>
            <p className="text-sm text-amber-700/70 dark:text-amber-300/70">
              {progress < 100 ? "Please wait..." : "Complete!"}
            </p>
          </div>
          <div className="ml-auto">
            <span className="text-lg font-bold text-amber-800 dark:text-amber-200">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}


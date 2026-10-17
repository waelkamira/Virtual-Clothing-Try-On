"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassPhotoUpload } from "@/components/glass-photo-upload"
import { GlassProcessingBar } from "@/components/glass-processing-bar"
import { ProductLinkInput } from "@/components/product-link-input"
import { ProductCard } from "@/components/product-card"
import { TryOnResult } from "@/components/try-on-result"
import { Sparkles, Shirt, ShoppingBag, Camera, ArrowRight, RefreshCw, Check } from "lucide-react"
import Link from "next/link"
import type { ProductData } from "@/app/actions/fetch-product"

export default function MobileViewPage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [fetchedProduct, setFetchedProduct] = useState<ProductData | null>(null)
  const [isTryingOn, setIsTryingOn] = useState(false)
  const [showTryOnResult, setShowTryOnResult] = useState(false)

  const handlePhotoUpload = (file: File) => {
    setUploadedPhoto(file)

    // Create URL for the uploaded photo
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
    }, 3000)
  }

  const handleProductFetched = (product: ProductData) => {
    setFetchedProduct(product)
  }

  const handleTryOn = () => {
    if (!uploadedPhoto) {
      alert("Please upload your photo first")
      return
    }

    setIsTryingOn(true)
    // Simulate processing
    setTimeout(() => {
      setIsTryingOn(false)
      setShowTryOnResult(true)
    }, 4000)
  }

  const handleReset = () => {
    setShowTryOnResult(false)
  }

  // Animation for success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-24 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-200 mb-2">Virtual Try-On</h1>
          <p className="text-amber-700/70 dark:text-amber-300/70 max-w-md mx-auto">
            Upload your photo and try on clothes from your favorite stores
          </p>
        </motion.div>

        {/* Product Link Input */}
        <ProductLinkInput onProductFetched={handleProductFetched} />

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="w-full lg:w-auto flex flex-col items-center">
            {!showTryOnResult ? (
              <>
                <GlassPhotoUpload onPhotoUpload={handlePhotoUpload} className="animate-float w-full max-w-sm" />

                {uploadedPhoto && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 glass-card px-4 py-2 flex items-center gap-2"
                  >
                    <div className="p-1 rounded-full bg-green-500/20">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-sm text-amber-800 dark:text-amber-200">Photo ready for try-on</span>
                    <button
                      onClick={() => {
                        setUploadedPhoto(null)
                        setPhotoUrl(null)
                      }}
                      className="ml-2 p-1 rounded-full hover:bg-white/10"
                    >
                      <RefreshCw className="h-3 w-3 text-amber-500" />
                    </button>
                  </motion.div>
                )}
              </>
            ) : photoUrl && fetchedProduct ? (
              <TryOnResult userPhoto={photoUrl} product={fetchedProduct} onReset={handleReset} />
            ) : null}
          </div>

          {fetchedProduct && !showTryOnResult ? (
            <ProductCard product={fetchedProduct} onTryOn={handleTryOn} />
          ) : !showTryOnResult ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                Virtual Fitting Room
              </h2>

              <p className="text-amber-700/70 dark:text-amber-300/70 mb-6">
                Our advanced AI technology allows you to see how clothes will look on you before making a purchase.
                Simply upload your photo and paste a product link to start trying on items.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Camera className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Upload Your Photo</h3>
                    <p className="text-sm text-amber-700/70 dark:text-amber-300/70">
                      Use any of the camera buttons to upload your photo
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Shirt className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Try On Clothes</h3>
                    <p className="text-sm text-amber-700/70 dark:text-amber-300/70">
                      Paste a product link and see how it looks on you
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Shop with Confidence</h3>
                    <p className="text-sm text-amber-700/70 dark:text-amber-300/70">
                      Purchase items you know will look great on you
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/stores">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center gap-2 shadow-lg"
                  >
                    Browse Stores
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* Success message with animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 glass-card px-6 py-3 flex items-center gap-3 z-50"
            >
              <div className="p-2 rounded-full bg-green-500/20">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  {isTryingOn ? "Virtual try-on complete!" : "Photo uploaded successfully!"}
                </h4>
                <p className="text-sm text-green-700/70 dark:text-green-300/70">
                  {isTryingOn ? "Looking great!" : "Ready for virtual try-on"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GlassProcessingBar
        isProcessing={isProcessing}
        onComplete={() => setIsProcessing(false)}
        message="Preparing your virtual try-on experience"
      />

      <GlassProcessingBar
        isProcessing={isTryingOn}
        onComplete={() => setIsTryingOn(false)}
        message="Applying virtual try-on"
        duration={4000}
      />
    </div>
  )
}


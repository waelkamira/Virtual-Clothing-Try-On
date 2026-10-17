"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { LinkIcon, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"

export default function UrlImportSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isImported, setIsImported] = useState(false)

  const handleImport = () => {
    if (!url) return

    setIsLoading(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          setIsImported(true)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-950/10 to-background z-0"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "-1px -1px",
          transform: "perspective(1000px) rotateX(60deg)",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Import from Any Online Store
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simply paste a URL from any e-commerce website and we'll extract all clothing items for you to try on
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 md:p-8 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <LinkIcon size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Paste e-commerce URL here (e.g., amazon.com/clothing/...)"
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading || isImported}
                />
              </div>
              <Button
                onClick={handleImport}
                disabled={!url || isLoading || isImported}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {isLoading ? (
                  <Loading size="sm" className="mr-2" />
                ) : isImported ? (
                  <Check className="mr-2 h-5 w-5" />
                ) : (
                  <LinkIcon className="mr-2 h-5 w-5" />
                )}
                {isLoading ? "Importing..." : isImported ? "Imported" : "Import Items"}
              </Button>
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loading showProgress progress={progress} />
                <p className="mt-4 text-muted-foreground">Extracting clothing items from the URL...</p>
              </div>
            )}

            {isImported && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Imported Items</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="group relative">
                      <div className="aspect-[3/4] bg-background/50 rounded-lg overflow-hidden border border-border group-hover:border-orange-500/50 transition-all">
                        <Image
                          src={`/placeholder.svg?height=300&width=200`}
                          alt={`Clothing item ${i}`}
                          width={200}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                          <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                            Try On
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium truncate">Product Name {i}</h4>
                        <p className="text-xs text-muted-foreground">$99.99</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => {
                      setUrl("")
                      setIsImported(false)
                    }}
                    variant="outline"
                    className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                  >
                    Import Another URL
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && !isImported && (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <LinkIcon size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Paste a URL to get started</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  We support most major e-commerce platforms including Amazon, Shopify stores, and individual retailer
                  websites.
                </p>
              </div>
            )}
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Fast Extraction",
                description: "Our advanced algorithms quickly extract all clothing items from any e-commerce page",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-500"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
              },
              {
                title: "One-Click Try-On",
                description: "Instantly try on any extracted item with a single click - no manual uploads needed",
                icon: <Check className="text-orange-500" />,
              },
              {
                title: "Wide Compatibility",
                description: "Works with thousands of online stores including Amazon, Shopify, and more",
                icon: <LinkIcon className="text-orange-500" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


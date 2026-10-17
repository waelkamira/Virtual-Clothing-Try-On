"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, ArrowRight, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-orange-950/10 z-0"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "-1px -1px",
          transform: `perspective(1000px) rotateX(60deg) translateY(${mousePosition.y * -20}px) translateX(${mousePosition.x * -20}px)`,
          transition: "transform 0.1s ease-out",
        }}
      ></div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-orange-500/20 blur-[100px] z-0"></div>
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 rounded-full bg-orange-600/20 blur-[100px] z-0"></div>

      <div className="container mx-auto px-4 z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-orange-500/10 text-orange-500 backdrop-blur-sm border border-orange-500/30 w-fit"
            >
              <span className="mr-2">✨</span>
              <span>Revolutionary Try-On Experience</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">Virtual</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                Clothing Try-On
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground mb-8"
            >
              Experience clothes shopping like never before. Try on items from any online store, see how they look on
              you, and share with friends - all from the comfort of your home.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="btn-3d bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:shadow-orange-500/20"
                asChild
              >
                <Link href="/try-on">
                  <Camera className="mr-2 h-5 w-5" />
                  <span>Start Try-On</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                asChild
              >
                <Link href="/import">
                  <LinkIcon className="mr-2 h-5 w-5" />
                  <span>Import from URL</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 flex items-center text-sm text-muted-foreground"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 mr-2">
                ✓
              </span>
              <span>5 free try-ons included</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <div className="relative z-10 mx-auto max-w-sm">
              {/* Phone mockup with try-on interface */}
              <div className="relative rounded-3xl overflow-hidden border-[6px] border-gray-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-900/30 to-background/80 z-10"></div>

                {/* Grid background */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(249, 115, 22, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.2) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "-1px -1px",
                    transform: "perspective(1000px) rotateX(60deg)",
                  }}
                ></div>

                <div className="relative z-20 aspect-[9/16] bg-black/30 backdrop-blur-sm">
                  {/* Interface elements */}
                  <div className="absolute top-6 left-6 z-30">
                    <div className="text-3xl font-bold text-white">VF</div>
                    <div className="text-sm font-medium text-orange-400">VIRTUAL TRY-ON</div>
                  </div>

                  {/* Upload placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 animate-pulse-slow">
                      <Camera size={40} className="text-orange-400" />
                    </div>
                  </div>

                  {/* Side control buttons */}
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-30">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 flex items-center justify-center"
                      >
                        {i === 1 && <Camera size={18} className="text-orange-400" />}
                        {i === 2 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-400"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m16.24 7.76-4.24 4.24-4.24-4.24" />
                          </svg>
                        )}
                        {i === 3 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-400"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom thumbnails */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-md bg-orange-500/20 backdrop-blur-md border border-orange-500/30"
                      ></div>
                    ))}
                  </div>

                  {/* Circular platform */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[70%] h-[1px] bg-orange-400/70 rounded-full z-30 shadow-[0_0_10px_3px_rgba(249,115,22,0.5)]"></div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-orange-500/20 blur-[50px] z-0"></div>
              <div className="absolute -top-5 -left-5 w-20 h-20 rounded-full bg-orange-400/20 blur-[30px] z-0"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


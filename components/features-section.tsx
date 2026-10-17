"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Camera, Shirt, LinkIcon, Download } from "lucide-react"

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Upload Your Photo",
      description:
        "Take a photo or upload an existing one to create your virtual model. Our AI technology creates a precise digital version of you.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <LinkIcon className="h-8 w-8" />,
      title: "Import from Any URL",
      description:
        "Paste a URL from any e-commerce store and our system will extract all clothing items available on that page for you to try on.",
      color: "from-orange-600 to-orange-700",
    },
    {
      icon: <Shirt className="h-8 w-8" />,
      title: "Virtual Try-On",
      description:
        "See how clothes look on you from different angles before purchasing. Our technology shows realistic fit, drape, and style.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Download & Share",
      description:
        "Download your virtual try-on images or share them directly to social media to get feedback from friends and family.",
      color: "from-orange-600 to-orange-700",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-950/10 to-background z-0"></div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 rounded-full bg-orange-500/10 blur-[100px] z-0"></div>
      <div className="absolute bottom-1/4 right-[5%] w-96 h-96 rounded-full bg-orange-600/10 blur-[100px] z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our innovative technology makes shopping for clothes easier and more confident than ever before
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <div className="rounded-2xl p-6 h-full bg-card/50 backdrop-blur-md border border-border hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
                <div
                  className={`bg-gradient-to-br ${feature.color} rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6 text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-orange-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


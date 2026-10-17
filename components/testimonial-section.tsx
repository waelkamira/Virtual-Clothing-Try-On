"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star } from "lucide-react"

export default function TestimonialSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "VirtualFit has completely changed how I shop online. Being able to see how clothes look on me before buying has saved me so much time and money on returns!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Tech Blogger",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "The URL import feature is genius! I can browse any store and instantly try on their clothes. The technology is impressive and the results are surprisingly realistic.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Online Shopper",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "I love sharing my virtual try-ons with friends to get their opinions. It's made shopping social again, even when we can't be together in person.",
      rating: 4,
    },
  ]

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-950/10 to-background z-0"></div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-orange-500/10 blur-[100px] z-0"></div>
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 rounded-full bg-orange-600/10 blur-[100px] z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have revolutionized the way they shop for clothes online
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-orange-500">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? "text-orange-500 fill-orange-500" : "text-muted-foreground"}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-orange-500 fill-orange-500" />
              ))}
            </span>
            <span className="text-sm">
              <span className="font-medium text-foreground">4.9/5</span> from over 2,000 reviews
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


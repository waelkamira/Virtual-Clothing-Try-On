"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Free Trial",
      description: "Perfect for trying out the platform",
      price: { monthly: 0, yearly: 0 },
      features: ["5 virtual try-ons", "Basic clothing catalog", "Standard image quality", "Share on social media"],
      cta: "Start Free Trial",
      href: "/try-on",
      popular: false,
    },
    {
      name: "Premium",
      description: "For fashion enthusiasts",
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        "Unlimited virtual try-ons",
        "Full clothing catalog",
        "High-resolution images",
        "URL import from any store",
        "Download generated images",
        "Priority support",
      ],
      cta: "Get Premium",
      href: "/subscription?plan=premium",
      popular: true,
    },
    {
      name: "Business",
      description: "For retailers and professionals",
      price: { monthly: 29.99, yearly: 299.99 },
      features: [
        "Everything in Premium",
        "API access",
        "White-label solution",
        "Advanced analytics",
        "Multiple user accounts",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ]

  return (
    <section ref={ref} id="pricing" className="py-20 relative overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with 5 free try-ons, then choose the plan that works best for you
          </p>

          <div className="flex items-center justify-center mt-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-full p-1 inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-orange-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === "yearly" ? "bg-orange-500 text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly <span className="text-xs opacity-75">Save 20%</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`relative bg-card/50 backdrop-blur-md border ${
                plan.popular ? "border-orange-500" : "border-border"
              } rounded-xl overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  {plan.name}
                  {plan.name !== "Free Trial" && <Crown className="ml-2 h-4 w-4 text-orange-500" />}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    {plan.price[billingCycle] === 0 ? "Free" : `$${plan.price[billingCycle]}`}
                  </span>
                  {plan.price[billingCycle] !== 0 && (
                    <span className="text-muted-foreground ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">All plans include a 14-day money-back guarantee. No questions asked.</p>
        </motion.div>
      </div>
    </section>
  )
}


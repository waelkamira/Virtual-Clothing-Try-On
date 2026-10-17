"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Crown, CreditCard } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "business">("premium")

  const plans = [
    {
      id: "premium",
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
    },
    {
      id: "business",
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
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Upgrade Your Plan</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 md:p-8 shadow-xl mb-8">
              <div className="flex items-center justify-center mb-8">
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
                      billingCycle === "yearly"
                        ? "bg-orange-500 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Yearly <span className="text-xs opacity-75">Save 20%</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-card/50 backdrop-blur-md border ${
                      selectedPlan === plan.id ? "border-orange-500" : "border-border"
                    } rounded-xl overflow-hidden cursor-pointer transition-all hover:border-orange-500/70`}
                    onClick={() => setSelectedPlan(plan.id as "premium" | "business")}
                  >
                    {selectedPlan === plan.id && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-medium">
                        Selected
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 flex items-center">
                        {plan.name}
                        <Crown className="ml-2 h-4 w-4 text-orange-500" />
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-3xl font-bold">${plan.price[billingCycle]}</span>
                        <span className="text-muted-foreground ml-2">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Payment Information</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <CreditCard size={20} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiration Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${plans.find((p) => p.id === selectedPlan)?.price[billingCycle]}</span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="flex justify-between mb-2 text-orange-500">
                    <span>Yearly discount</span>
                    <span>-20%</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span>${plans.find((p) => p.id === selectedPlan)?.price[billingCycle]}</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Crown className="mr-2 h-5 w-5" />
                Subscribe Now
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription
                at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Check, ShoppingBag, Truck, Shield, ChevronDown } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useStore } from "@/contexts/store-context"
import { useToast } from "@/components/ui/use-toast"

// Checkout steps
const STEPS = {
  CART: "cart",
  SHIPPING: "shipping",
  PAYMENT: "payment",
  CONFIRMATION: "confirmation",
}

export default function CheckoutPage() {
  const { selectedItems } = useStore()
  const [step, setStep] = useState(STEPS.CART)
  const [formData, setFormData] = useState({
    // Shipping info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Payment info
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",

    // Other
    saveInfo: true,
    shippingMethod: "standard",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === STEPS.CART) {
      setStep(STEPS.SHIPPING)
    } else if (step === STEPS.SHIPPING) {
      setStep(STEPS.PAYMENT)
    } else if (step === STEPS.PAYMENT) {
      processPayment()
    }
  }

  const processPayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setStep(STEPS.CONFIRMATION)

      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and will be shipped soon.",
      })
    }, 2000)
  }

  // Calculate order summary
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const shipping = formData.shippingMethod === "express" ? 15 : 5
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

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
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>

          {/* Checkout steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {Object.values(STEPS).map((s, index) => (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      step === s
                        ? "bg-orange-500 text-white"
                        : Object.values(STEPS).indexOf(step) > index
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {Object.values(STEPS).indexOf(step) > index ? <Check size={16} /> : index + 1}
                  </div>
                  <span
                    className={`text-xs capitalize ${
                      step === s
                        ? "text-orange-500 font-medium"
                        : Object.values(STEPS).indexOf(step) > index
                          ? "text-green-500"
                          : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}

              {/* Progress bar */}
              <div className="absolute left-0 right-0 h-1 bg-muted">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{
                    width: `${(Object.values(STEPS).indexOf(step) / (Object.values(STEPS).length - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {step === STEPS.CART && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-orange-500" />
                    Your Cart
                  </h2>

                  {selectedItems.length > 0 ? (
                    <div className="space-y-4">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-background/50 rounded-lg border border-border">
                          <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded">
                                Size: {item.size}
                              </span>
                              <span className="text-sm font-medium text-orange-500">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-border">
                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          onClick={handleSubmit}
                        >
                          Proceed to Shipping
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <ShoppingBag size={24} />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        You haven't added any items to your cart yet. Browse our catalog to find items you'd like to
                        purchase.
                      </p>
                      <Button
                        variant="default"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        asChild
                      >
                        <Link href="/catalog">
                          Browse Catalog
                          <ShoppingBag className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === STEPS.SHIPPING && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-orange-500" />
                    Shipping Information
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Japan">Japan</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Shipping Method</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="standard"
                            name="shippingMethod"
                            value="standard"
                            checked={formData.shippingMethod === "standard"}
                            onChange={handleChange}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="standard" className="ml-2 flex-1">
                            <div className="font-medium">Standard Shipping</div>
                            <div className="text-sm text-muted-foreground">Delivery in 5-7 business days</div>
                          </label>
                          <span className="font-medium">$5.00</span>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="express"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === "express"}
                            onChange={handleChange}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="express" className="ml-2 flex-1">
                            <div className="font-medium">Express Shipping</div>
                            <div className="text-sm text-muted-foreground">Delivery in 1-3 business days</div>
                          </label>
                          <span className="font-medium">$15.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mb-6">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <label htmlFor="saveInfo" className="ml-2 text-sm">
                        Save this information for next time
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                        onClick={() => setStep(STEPS.CART)}
                      >
                        Back to Cart
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      >
                        Continue to Payment
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === STEPS.PAYMENT && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-orange-500" />
                    Payment Information
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                            className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                            className="w-full px-3 py-2 bg-background/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-6">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-orange-500 mr-2" />
                        <p className="text-sm">
                          Your payment information is secure. We use industry-standard encryption to protect your data.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                        onClick={() => setStep(STEPS.SHIPPING)}
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Place Order
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === STEPS.CONFIRMATION && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6"
                >
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Check size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                    </p>

                    <div className="bg-background/50 border border-border rounded-lg p-4 mb-6 inline-block">
                      <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                      <div className="font-medium text-lg">#ORD-{Math.floor(100000 + Math.random() * 900000)}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500"
                        asChild
                      >
                        <Link href="/profile">View Order History</Link>
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        asChild
                      >
                        <Link href="/catalog">
                          Continue Shopping
                          <ShoppingBag className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => {
                      const element = document.getElementById("promo-code")
                      if (element) {
                        element.classList.toggle("hidden")
                      }
                    }}
                  >
                    <span className="font-medium">Apply Promo Code</span>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </button>

                  <div id="promo-code" className="hidden mt-4">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 bg-background/50 border border-input rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <Button className="rounded-l-none bg-orange-500 hover:bg-orange-600">Apply</Button>
                    </div>
                  </div>
                </div>

                {step !== STEPS.CONFIRMATION && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-orange-500" />
                      <span>Secure Checkout</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4 text-orange-500" />
                      <span>Free Returns</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-orange-500" />
                      <span>Satisfaction Guaranteed</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


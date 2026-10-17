"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "general",
      name: "General Questions",
      faqs: [
        {
          id: "what-is",
          question: "What is Virtual Style Studio?",
          answer:
            "Virtual Style Studio is an innovative platform that allows you to virtually try on clothing from various online retailers without physically wearing them. Using advanced image processing and 3D rendering technology, we create a realistic preview of how clothes would look on you.",
        },
        {
          id: "how-works",
          question: "How does the virtual try-on feature work?",
          answer:
            "Our virtual try-on technology uses a combination of your uploaded photos or measurements, advanced image processing, and 3D modeling to create a realistic representation of how clothing items would look on you. The system analyzes the garment's structure and your body shape to generate an accurate visualization.",
        },
        {
          id: "supported-stores",
          question: "Which online stores are supported?",
          answer:
            "We support a wide range of popular online retailers including Amazon, ASOS, H&M, Zara, Nike, Adidas, and many more. We're constantly adding new stores to our platform. If you have a specific store you'd like us to add, please let us know through our feedback form.",
        },
      ],
    },
    {
      id: "account",
      name: "Account & Privacy",
      faqs: [
        {
          id: "create-account",
          question: "Do I need to create an account?",
          answer:
            "While you can browse and explore basic features without an account, creating a free account allows you to save your measurements, favorite items, and access your virtual try-on history. It also enables personalized recommendations based on your style preferences.",
        },
        {
          id: "data-privacy",
          question: "How is my data and photos protected?",
          answer:
            "We take your privacy very seriously. All photos and body measurements are encrypted and stored securely. We never share your personal data with third parties without your explicit consent. You can delete your photos and data at any time. For more details, please review our Privacy Policy.",
        },
        {
          id: "delete-account",
          question: "How do I delete my account?",
          answer:
            "You can delete your account by going to your Profile Settings and selecting the 'Delete Account' option. This will permanently remove all your personal information, photos, and data from our servers. Please note that this action cannot be undone.",
        },
      ],
    },
    {
      id: "technical",
      name: "Technical Support",
      faqs: [
        {
          id: "browser-support",
          question: "Which browsers are supported?",
          answer:
            "Our platform works best on modern browsers like Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of these browsers. Some features may not work properly on older browsers or Internet Explorer.",
        },
        {
          id: "mobile-support",
          question: "Can I use Virtual Style Studio on mobile devices?",
          answer:
            "Yes, our platform is fully responsive and works on smartphones and tablets. We also offer dedicated mobile apps for iOS and Android for an enhanced experience with additional features like AR try-on.",
        },
        {
          id: "troubleshooting",
          question: "The virtual try-on isn't working correctly. What should I do?",
          answer:
            "If you're experiencing issues with the virtual try-on feature, try the following: 1) Make sure you're using a supported browser, 2) Check that your photos meet our guidelines for quality and positioning, 3) Clear your browser cache and cookies, 4) Ensure you have a stable internet connection. If problems persist, please contact our support team.",
        },
      ],
    },
    {
      id: "subscription",
      name: "Subscription & Billing",
      faqs: [
        {
          id: "free-trial",
          question: "Is there a free trial?",
          answer:
            "Yes, we offer a free trial that allows you to try on up to 5 items. This gives you a chance to experience our virtual try-on technology before deciding to subscribe to a premium plan.",
        },
        {
          id: "subscription-plans",
          question: "What subscription plans are available?",
          answer:
            "We offer several subscription tiers: Basic ($4.99/month) which includes unlimited try-ons and basic features, Premium ($9.99/month) which adds size recommendations and style suggestions, and Pro ($14.99/month) which includes all features plus priority support and exclusive deals from partner stores.",
        },
        {
          id: "cancel-subscription",
          question: "How do I cancel my subscription?",
          answer:
            "You can cancel your subscription at any time by going to your Account Settings and selecting 'Manage Subscription'. Your subscription will remain active until the end of your current billing period. We don't offer refunds for partial subscription periods.",
        },
      ],
    },
  ]

  // Filter FAQs based on search query
  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqCategories
      : faqCategories
          .map((category) => ({
            ...category,
            faqs: category.faqs.filter(
              (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          }))
          .filter((category) => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative mb-8">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search for questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(
              (category) =>
                category.faqs.length > 0 && (
                  <div key={category.id} className="mb-8">
                    <h2 className="text-xl font-bold mb-4">{category.name}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.faqs.map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border border-border rounded-lg overflow-hidden"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                            <span className="text-left font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 py-4 bg-muted/20">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ),
            )
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}

          <div className="mt-12 p-6 bg-muted/20 border border-border rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              If you couldn't find the answer you were looking for, our support team is here to help.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import UrlImportSection from "@/components/url-import-section"
import TestimonialSection from "@/components/testimonial-section"
import PricingSection from "@/components/pricing-section"
import Footer from "@/components/footer"
import SearchBar from "@/components/search-bar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-4">
        <SearchBar />
      </div>
      <HeroSection />
      <FeaturesSection />
      <UrlImportSection />
      <TestimonialSection />
      <PricingSection />
      <Footer />
    </div>
  )
}


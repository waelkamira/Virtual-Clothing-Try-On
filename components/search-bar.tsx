"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Popular search suggestions
  const suggestions = ["Summer dresses", "Men's shirts", "Casual shoes", "Jeans", "Jackets"]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
        <h2 className="text-lg font-medium mb-3 text-center">Find and try on any clothing</h2>

        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search size={20} />
          </div>

          <Input
            type="text"
            placeholder="Search for any product..."
            className="pl-10 pr-20 h-12 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />

          <Button
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 h-10"
            onClick={handleSearch}
          >
            Search
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        {showSuggestions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-background/50 border border-border rounded-full text-sm hover:border-orange-500/50 hover:bg-orange-500/10 transition-colors"
                onClick={() => {
                  setSearchQuery(suggestion)
                  handleSearch()
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-4 text-sm">
          <button className="text-orange-500 hover:text-orange-600 mr-4" onClick={() => router.push("/online-search")}>
            Search Online
          </button>
          <span className="text-muted-foreground mx-2">•</span>
          <button className="text-orange-500 hover:text-orange-600 ml-4" onClick={() => router.push("/stores")}>
            Browse Stores
          </button>
        </div>
      </div>
    </div>
  )
}


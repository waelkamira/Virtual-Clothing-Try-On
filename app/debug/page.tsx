"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bug, Check, AlertTriangle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { checkAllLinks, fixBrokenLinks } from "@/lib/navigation-utils"
import { highlightButtonsWithoutListeners, fixCommonButtonIssues } from "@/lib/button-utils"
import ButtonWrapper from "@/components/button-wrapper"

export default function DebugPage() {
  const [brokenLinks, setBrokenLinks] = useState<{ element: HTMLAnchorElement; href: string }[]>([])
  const [debugMode, setDebugMode] = useState(false)
  const [fixApplied, setFixApplied] = useState(false)

  useEffect(() => {
    // Check for broken links when the component mounts
    const links = checkAllLinks()
    if (links) {
      setBrokenLinks(links)
    }
  }, [])

  const toggleDebugMode = () => {
    setDebugMode(!debugMode)

    if (!debugMode) {
      highlightButtonsWithoutListeners()
    } else {
      document.querySelectorAll(".debug-outline").forEach((el) => {
        el.classList.remove("debug-outline")
      })
    }
  }

  const applyFixes = () => {
    fixBrokenLinks()
    fixCommonButtonIssues()
    setFixApplied(true)

    // Re-check links after fixes
    const links = checkAllLinks()
    if (links) {
      setBrokenLinks(links)
    }

    // Show success message
    setTimeout(() => {
      setFixApplied(false)
    }, 3000)
  }

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
            <h1 className="text-2xl font-bold">Debug & Fix Tools</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bug className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold">Button & Link Diagnostics</h2>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="debug-mode" className="flex items-center gap-2 cursor-pointer">
                    <span>Button Debug Mode</span>
                  </label>
                  <div className="relative inline-block w-10 h-5">
                    <input
                      id="debug-mode"
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={debugMode}
                      onChange={toggleDebugMode}
                    />
                    <span
                      className={`absolute cursor-pointer inset-0 rounded-full transition-colors ${
                        debugMode ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                          debugMode ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></span>
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, buttons without event listeners will be highlighted with a red outline
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={applyFixes}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {fixApplied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Fixes Applied
                    </>
                  ) : (
                    <>
                      <Bug className="mr-2 h-4 w-4" />
                      Auto-Fix Buttons & Links
                    </>
                  )}
                </Button>

                {brokenLinks.length > 0 ? (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <h3 className="font-medium text-destructive">Found {brokenLinks.length} broken links</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      The following links have missing or invalid href attributes:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                      {brokenLinks.slice(0, 5).map((link, index) => (
                        <li key={index}>
                          {link.element.textContent || "Unnamed link"} - href: "{link.href}"
                        </li>
                      ))}
                      {brokenLinks.length > 5 && <li>...and {brokenLinks.length - 5} more</li>}
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-green-500">All links appear to be valid</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bug className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-bold">Test Buttons</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Use these buttons to test different button behaviors and fixes
              </p>

              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium mb-2">Regular Buttons</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => alert("Button clicked!")}>Working Button</Button>
                    <Button>Non-functional Button</Button>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium mb-2">Link Buttons</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild>
                      <Link href="/catalog">Working Link</Link>
                    </Button>
                    <Button asChild>
                      <a>Broken Link</a>
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium mb-2">ButtonWrapper Component</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <ButtonWrapper
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                      isLink
                      href="/catalog"
                    >
                      Fixed Link Button
                    </ButtonWrapper>
                    <ButtonWrapper
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                      fallbackMessage="This button will be functional soon!"
                    >
                      Fallback Button
                    </ButtonWrapper>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-card/50 backdrop-blur-md border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold">Implementation Guide</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Use ButtonWrapper for all buttons</h3>
                <p className="text-sm text-muted-foreground">
                  Replace standard buttons with the ButtonWrapper component to ensure all buttons have proper error
                  handling and fallbacks.
                </p>
                <pre className="mt-2 p-3 bg-background/50 rounded-md text-xs overflow-x-auto">
                  {`import ButtonWrapper from '@/components/button-wrapper'

// Instead of:
<button onClick={handleClick}>Click Me</button>

// Use:
<ButtonWrapper onClick={handleClick}>Click Me</ButtonWrapper>

// For links:
<ButtonWrapper isLink href="/catalog">Go to Catalog</ButtonWrapper>

// With fallback message:
<ButtonWrapper fallbackMessage="Feature coming soon!">Coming Soon</ButtonWrapper>`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Use the navigation utilities</h3>
                <p className="text-sm text-muted-foreground">
                  Import and use the navigation utilities for programmatic navigation with proper error handling.
                </p>
                <pre className="mt-2 p-3 bg-background/50 rounded-md text-xs overflow-x-auto">
                  {`import { useNavigation } from '@/lib/navigation-utils'

function MyComponent() {
  const { navigateTo, navigateBack } = useNavigation()
  
  const handleButtonClick = () => {
    navigateTo('/catalog')
  }
  
  return (
    <button onClick={handleButtonClick}>Go to Catalog</button>
  )
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">3. Run diagnostics in development</h3>
                <p className="text-sm text-muted-foreground">
                  Use the debug tools to identify and fix button issues during development.
                </p>
                <pre className="mt-2 p-3 bg-background/50 rounded-md text-xs overflow-x-auto">
                  {`// Press Ctrl+Shift+D to open the debug panel
// Or visit /debug to use the debug tools

// You can also run these functions in the console:
checkAllLinks()
fixBrokenLinks()
highlightButtonsWithoutListeners()
fixCommonButtonIssues()`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


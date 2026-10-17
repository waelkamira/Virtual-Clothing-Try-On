"use client"

import { useEffect, useState } from "react"
import { Bug, Wrench, X } from "lucide-react"
import { highlightButtonsWithoutListeners, fixCommonButtonIssues } from "@/lib/button-utils"

export default function DebugTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== "development") return

    // Add keyboard shortcut (Ctrl+Shift+D) to toggle debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsOpen((prev) => !prev)
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (debugMode) {
      document.body.classList.add("debug-mode")
      highlightButtonsWithoutListeners()
    } else {
      document.body.classList.remove("debug-mode")
      document.querySelectorAll(".debug-outline").forEach((el) => {
        el.classList.remove("debug-outline")
      })
    }
  }, [debugMode])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-orange-500 text-white rounded-full shadow-lg z-50 hover:bg-orange-600 transition-colors"
        aria-label="Open Debug Tools"
      >
        <Bug size={20} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="p-3 bg-orange-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug size={18} />
          <span className="font-medium">Debug Tools</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close Debug Panel"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-4">
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
                onChange={() => setDebugMode(!debugMode)}
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
          <p className="text-xs text-muted-foreground">Highlights buttons without event listeners or href attributes</p>
        </div>

        <button
          onClick={fixCommonButtonIssues}
          className="w-full flex items-center justify-center gap-2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <Wrench size={16} />
          <span>Attempt Auto-Fix</span>
        </button>

        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-md">
          <h3 className="text-sm font-medium mb-1">Keyboard Shortcuts</h3>
          <p className="text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">Ctrl</kbd>+
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">Shift</kbd>+
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs">D</kbd>: Toggle debug
            panel
          </p>
        </div>
      </div>
    </div>
  )
}


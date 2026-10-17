"use client"

import { useRouter, usePathname } from "next/navigation"

/**
 * Custom hook to handle navigation with proper error handling
 */
export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigateTo = (path: string) => {
    try {
      // Check if the path is valid
      if (!path) {
        console.error("Invalid path provided for navigation")
        return
      }

      // Check if we're already on this page
      if (pathname === path) {
        console.log("Already on this page, no navigation needed")
        return
      }

      // Navigate to the path
      router.push(path)
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  const navigateBack = () => {
    try {
      router.back()
    } catch (error) {
      console.error("Navigation back error:", error)
      // Fallback to home page if back navigation fails
      router.push("/")
    }
  }

  return {
    navigateTo,
    navigateBack,
    currentPath: pathname,
  }
}

/**
 * Function to ensure all links in the application are working
 * This can be called during development to check for broken links
 */
export function checkAllLinks() {
  if (typeof window === "undefined") return

  const links = document.querySelectorAll("a")
  const brokenLinks: { element: HTMLAnchorElement; href: string }[] = []

  links.forEach((link) => {
    const href = link.getAttribute("href")

    if (!href || href === "#" || href === "javascript:void(0)") {
      brokenLinks.push({ element: link as HTMLAnchorElement, href: href || "empty" })
    }
  })

  if (brokenLinks.length > 0) {
    console.warn("Found broken links:", brokenLinks)
  } else {
    console.log("All links appear to be valid")
  }

  return brokenLinks
}

/**
 * Function to fix common link issues
 */
export function fixBrokenLinks() {
  if (typeof window === "undefined") return

  // Fix links with missing href
  document.querySelectorAll("a:not([href])").forEach((link) => {
    // Try to determine the correct href from data attributes
    const dataHref = link.getAttribute("data-href")
    const dataPath = link.getAttribute("data-path")
    const dataRoute = link.getAttribute("data-route")

    if (dataHref) {
      link.setAttribute("href", dataHref)
    } else if (dataPath) {
      link.setAttribute("href", dataPath)
    } else if (dataRoute) {
      link.setAttribute("href", dataRoute)
    } else {
      // If we can't determine a valid href, at least make it do nothing instead of causing errors
      link.setAttribute("href", "javascript:void(0)")
    }
  })

  // Fix links with # href that should navigate somewhere
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    const dataHref = link.getAttribute("data-href")
    const dataPath = link.getAttribute("data-path")
    const dataRoute = link.getAttribute("data-route")

    if (dataHref) {
      link.setAttribute("href", dataHref)
    } else if (dataPath) {
      link.setAttribute("href", dataPath)
    } else if (dataRoute) {
      link.setAttribute("href", dataRoute)
    }
  })
}


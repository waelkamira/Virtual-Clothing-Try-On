/**
 * Utility functions for debugging and fixing button functionality
 */

// Function to check if a button has event listeners
export function checkButtonEventListeners(button: HTMLButtonElement | null): boolean {
  if (!button) return false

  // This is a simplified check - in a real app, we'd need more sophisticated methods
  // to detect event listeners
  const hasOnClick = button.onclick !== null
  const hasHref = button.tagName.toLowerCase() === "a" && (button as HTMLAnchorElement).href !== ""

  return hasOnClick || hasHref
}

// Function to add a debug outline to buttons without event listeners
export function highlightButtonsWithoutListeners(): void {
  const buttons = document.querySelectorAll('button, a.btn, [role="button"]')

  buttons.forEach((button) => {
    const hasListeners = checkButtonEventListeners(button as HTMLButtonElement)

    if (!hasListeners) {
      button.classList.add("debug-outline")
      console.warn("Button without event listener:", button)
    }
  })
}

// Function to fix common button issues
export function fixCommonButtonIssues(): void {
  // Fix buttons that should be links
  document.querySelectorAll("button[data-href]").forEach((button) => {
    button.addEventListener("click", () => {
      const href = button.getAttribute("data-href")
      if (href) {
        window.location.href = href
      }
    })
  })

  // Fix buttons with incorrect event names
  document.querySelectorAll("[data-click]").forEach((element) => {
    const clickHandler = element.getAttribute("data-click")
    if (clickHandler && typeof window[clickHandler as keyof Window] === "function") {
      element.addEventListener("click", () => {
        ;(window[clickHandler as keyof Window] as Function)()
      })
    }
  })
}

// Function to create a debug overlay
export function createButtonDebugOverlay(): void {
  const overlay = document.createElement("div")
  overlay.style.position = "fixed"
  overlay.style.bottom = "20px"
  overlay.style.right = "20px"
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
  overlay.style.color = "white"
  overlay.style.padding = "10px"
  overlay.style.borderRadius = "5px"
  overlay.style.zIndex = "9999"
  overlay.style.fontSize = "14px"

  const title = document.createElement("div")
  title.textContent = "Button Debug Mode"
  title.style.fontWeight = "bold"
  title.style.marginBottom = "5px"

  const toggleButton = document.createElement("button")
  toggleButton.textContent = "Highlight Non-Functional Buttons"
  toggleButton.style.backgroundColor = "#f97316"
  toggleButton.style.color = "white"
  toggleButton.style.border = "none"
  toggleButton.style.padding = "5px 10px"
  toggleButton.style.borderRadius = "3px"
  toggleButton.style.cursor = "pointer"
  toggleButton.style.marginTop = "5px"

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("debug-buttons")

    if (document.body.classList.contains("debug-buttons")) {
      highlightButtonsWithoutListeners()
      toggleButton.textContent = "Hide Highlights"
    } else {
      document.querySelectorAll(".debug-outline").forEach((el) => {
        el.classList.remove("debug-outline")
      })
      toggleButton.textContent = "Highlight Non-Functional Buttons"
    }
  })

  const fixButton = document.createElement("button")
  fixButton.textContent = "Attempt Auto-Fix"
  fixButton.style.backgroundColor = "#22c55e"
  fixButton.style.color = "white"
  fixButton.style.border = "none"
  fixButton.style.padding = "5px 10px"
  fixButton.style.borderRadius = "3px"
  fixButton.style.cursor = "pointer"
  fixButton.style.marginTop = "5px"
  fixButton.style.marginLeft = "5px"

  fixButton.addEventListener("click", () => {
    fixCommonButtonIssues()
  })

  overlay.appendChild(title)
  overlay.appendChild(toggleButton)
  overlay.appendChild(fixButton)

  document.body.appendChild(overlay)

  // Add debug styles
  const style = document.createElement("style")
  style.textContent = `
    .debug-outline {
      outline: 2px dashed red !important;
      position: relative;
    }
    
    .debug-outline::after {
      content: "❌";
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: red;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  `

  document.head.appendChild(style)
}


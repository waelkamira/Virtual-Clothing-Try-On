import ColorThief from "colorthief";

const { getColor, getPalette } = ColorThief as any;

export interface ExtractedColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export async function extractColorsFromImage(imageUrl: string): Promise<ExtractedColors> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = "Anonymous"

      img.onload = () => {
        try {
          // Get dominant color and a palette
          const dominantColor = getColor(img)
          const palette = getPalette(img, 5)

          // Convert RGB to hex
          const primaryHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])
          const secondaryHex = rgbToHex(palette[1][0], palette[1][1], palette[1][2])
          const accentHex = rgbToHex(palette[2][0], palette[2][1], palette[2][2])

          // Create a background color (lighter version of dominant)
          const backgroundHex = lightenColor(primaryHex, 0.85)

          // Determine if text should be dark or light based on background
          const textHex = isLightColor(backgroundHex) ? "#111111" : "#FFFFFF"

          resolve({
            primary: primaryHex,
            secondary: secondaryHex,
            accent: accentHex,
            background: backgroundHex,
            text: textHex,
          })
        } catch (error) {
          console.error("Error extracting colors:", error)
          // Fallback to default colors
          resolve({
            primary: "#f97316",
            secondary: "#fb923c",
            accent: "#ea580c",
            background: "#fff7ed",
            text: "#111111",
          })
        }
      }

      img.onerror = () => {
        console.error("Error loading image for color extraction")
        // Fallback to default colors
        resolve({
          primary: "#f97316",
          secondary: "#fb923c",
          accent: "#ea580c",
          background: "#fff7ed",
          text: "#111111",
        })
      }

      img.src = imageUrl
    } catch (error) {
      console.error("Error in color extraction process:", error)
      // Fallback to default colors
      resolve({
        primary: "#f97316",
        secondary: "#fb923c",
        accent: "#ea580c",
        background: "#fff7ed",
        text: "#111111",
      })
    }
  })
}

// Helper functions
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
  )
}

function lightenColor(hex: string, amount: number): string {
  let r = Number.parseInt(hex.substring(1, 3), 16)
  let g = Number.parseInt(hex.substring(3, 5), 16)
  let b = Number.parseInt(hex.substring(5, 7), 16)

  r = Math.min(255, Math.round(r + (255 - r) * amount))
  g = Math.min(255, Math.round(g + (255 - g) * amount))
  b = Math.min(255, Math.round(b + (255 - b) * amount))

  return rgbToHex(r, g, b)
}

function isLightColor(hex: string): boolean {
  const r = Number.parseInt(hex.substring(1, 3), 16)
  const g = Number.parseInt(hex.substring(3, 5), 16)
  const b = Number.parseInt(hex.substring(5, 7), 16)

  // Calculate perceived brightness using the formula: (0.299*R + 0.587*G + 0.114*B)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return brightness > 0.5
}


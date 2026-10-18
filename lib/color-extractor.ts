import { getColor, getPalette } from "colorthief";

function colorToRgb(color: unknown): [number, number, number] | null {
  if (!color || typeof color !== "object") return null

  const value = color as { rgb?: () => [number, number, number]; toRgb?: () => [number, number, number] }
  const rgb = value.rgb?.() ?? value.toRgb?.()
  return Array.isArray(rgb) && rgb.length >= 3 ? [rgb[0], rgb[1], rgb[2]] : null
}

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

      img.onload = async () => {
        try {
          // ColorThief 3 returns Color objects from its async API.
          const dominantColor = colorToRgb(await getColor(img))
          const palette = (await getPalette(img, { colorCount: 5 }))
            ?.map(colorToRgb)
            .filter((color): color is [number, number, number] => color !== null) ?? []

          if (!dominantColor || palette.length < 3) {
            throw new Error("Unable to extract a usable color palette")
          }

          // Convert RGB to hex
          const primaryHex = rgbToHex(...dominantColor)
          const secondaryHex = rgbToHex(...palette[1])
          const accentHex = rgbToHex(...palette[2])

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


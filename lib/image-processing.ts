export type ViewType = "front"

export interface ProcessedImage {
  url: string
  viewType: ViewType
}

export interface ClothingItem {
  id: string
  image: string
  category: string
  name?: string
  color: string
  size: string
}

export class ImageProcessingService {
  async mergeUserPhotoWithClothing(
    userPhotoUrl: string,
    clothingItem: ClothingItem,
    viewType: ViewType,
  ): Promise<string> {
    const response = await fetch("/api/try-on", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPhotoUrl,
        itemImageUrl: clothingItem.image,
        category: clothingItem.category,
        itemDescription: [clothingItem.color, clothingItem.name, clothingItem.category]
          .filter(Boolean)
          .join(" "),
        viewType,
      }),
    })
    const data: unknown = await response.json()
    if (
      !response.ok ||
      typeof data !== "object" ||
      data === null ||
      !("url" in data) ||
      typeof data.url !== "string"
    ) {
      const message =
        typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
          ? data.error
          : "Try-on generation failed"
      throw new Error(message)
    }
    return data.url
  }

  async generateView(
    userPhotoUrl: string,
    clothingItem: ClothingItem,
    viewType: ViewType,
  ): Promise<ProcessedImage> {
    const url = await this.mergeUserPhotoWithClothing(userPhotoUrl, clothingItem, viewType)
    return { url, viewType }
  }

  async generateAllViews(userPhotoUrl: string, clothingItem: ClothingItem): Promise<ProcessedImage[]> {
    const front = await this.generateView(userPhotoUrl, clothingItem, "front")
    return [front]
  }

  async extractBodyMeasurements(userPhotoUrl: string): Promise<Record<string, number>> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      height: 175,
      shoulder: 45,
      chest: 95,
      waist: 80,
      hip: 95,
      inseam: 80,
    }
  }

  recommendSize(measurements: Record<string, number>, category: string): string {
    const value = category.toLowerCase()
    if (value.includes("top") || value.includes("shirt") || value.includes("dress") || value.includes("outer")) {
      const chest = measurements.chest
      if (chest < 90) return "S"
      if (chest < 100) return "M"
      if (chest < 110) return "L"
      return "XL"
    }
    if (value.includes("bottom") || value.includes("pant") || value.includes("jean") || value.includes("short")) {
      const waist = measurements.waist
      if (waist < 75) return "S"
      if (waist < 85) return "M"
      if (waist < 95) return "L"
      return "XL"
    }
    return "M"
  }
}

export const imageProcessor = new ImageProcessingService()

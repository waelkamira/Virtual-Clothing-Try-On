import { generateImage } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userPhotoUrl = typeof body.userPhotoUrl === "string" ? body.userPhotoUrl : ""
    const itemImageUrl = typeof body.itemImageUrl === "string" ? body.itemImageUrl : ""
    const category = typeof body.category === "string" ? body.category : "clothing"
    if (!userPhotoUrl || !itemImageUrl) return NextResponse.json({ error: "Both images are required" }, { status: 400 })

    const prompt = `Create a photorealistic virtual try-on image. Preserve the person's face, body pose, skin tone, lighting, background, and camera framing from the person photo. Replace only the ${category.toLowerCase()} with the exact product shown in the item photo, fitting it naturally to the body. Do not add text, logos, extra limbs, or change the person's identity. Person photo: ${userPhotoUrl}. Product photo: ${itemImageUrl}.`
    const result = await generateImage({ model: "google/gemini-2.5-flash-image", prompt, size: "1024x1024" })
    const image = result.images[0]
    if (!image) throw new Error("The image model returned no image")
    const dataUrl = `data:${image.mediaType};base64,${image.base64}`
    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error("[v0] Try-on generation failed", error)
    return NextResponse.json({ error: "Try-on generation is temporarily unavailable" }, { status: 502 })
  }
}

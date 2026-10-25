import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    if (!(file instanceof File)) return NextResponse.json({ error: "No image provided" }, { status: 400 })
    if (!allowedTypes.has(file.type) || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Use a JPG, PNG, or WebP image up to 10MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`

    try {
      const extension = file.type.split("/")[1]
      const pathname = `try-on/${crypto.randomUUID()}.${extension}`
      await put(pathname, buffer, { access: "private", addRandomSuffix: false, contentType: file.type })
      return NextResponse.json({ url: `/api/file?pathname=${encodeURIComponent(pathname)}` })
    } catch (blobError) {
      console.warn("[v0] Blob upload unavailable, using inline image", blobError)
      return NextResponse.json({ url: dataUrl })
    }
  } catch (error) {
    console.error("[v0] Upload failed", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

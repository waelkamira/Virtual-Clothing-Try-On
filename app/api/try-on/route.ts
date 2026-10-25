import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import { NextResponse } from "next/server"
import { z } from "zod"

const TRY_ON_SPACE_URL = "https://yisol-idm-vton.hf.space"
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

interface ImageFile {
  bytes: Buffer
  mimeType: string
  filename: string
}

interface GradioFile {
  path: string
  url?: string
}

class InvalidTryOnRequestError extends Error {}

interface TryOnInput {
  person: ImageFile
  garment: ImageFile
  category: string
  description: string
}

interface TryOnProvider {
  id: string
  name: string
  tier: "free" | "paid"
  enabled: () => boolean
  generate: (input: TryOnInput) => Promise<string>
}

const requestSchema = z.object({
  userPhotoUrl: z.string().min(1).max(15_000_000),
  itemImageUrl: z.string().min(1).max(15_000_000),
  category: z.string().trim().max(100).optional(),
  itemDescription: z.string().trim().max(300).optional(),
  viewType: z.literal("front").optional(),
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPublicAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [first, second, third] = address.split(".").map(Number)
    return !(
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 0) ||
      (first === 192 && second === 88 && third === 99) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19)) ||
      (first === 198 && second === 51 && third === 100) ||
      (first === 203 && second === 0 && third === 113) ||
      first >= 224
    )
  }

  if (isIP(address) !== 6) return false
  const normalized = address.toLowerCase()
  const firstHextet = Number.parseInt(normalized.split(":")[0] || "0", 16)
  return (
    firstHextet >= 0x2000 &&
    firstHextet < 0x4000 &&
    !normalized.startsWith("2001:db8:")
  )
}

async function validateRemoteHost(hostname: string): Promise<void> {
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new InvalidTryOnRequestError("Images must use a secure public URL")
  }
  let addresses: Array<{ address: string; family: number }>
  try {
    addresses = await lookup(hostname, { all: true })
  } catch {
    throw new InvalidTryOnRequestError("Unable to resolve the image host")
  }
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new InvalidTryOnRequestError("Images must use a secure public URL")
  }
}

function filenameForType(mimeType: string, name: string): string {
  const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1]
  return `${name}.${extension}`
}

async function readLimited(response: Response, maxBytes: number, name: string): Promise<Buffer> {
  if (!response.body) throw new Error(`${name} response had no body`)
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      throw new Error(`${name} exceeds the ${Math.floor(maxBytes / (1024 * 1024))}MB image limit`)
    }
    chunks.push(value)
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), size)
}

async function loadImage(value: string, request: Request, name: string): Promise<ImageFile> {
  let bytes: Buffer
  let mimeType: string

  if (value.startsWith("data:")) {
    const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/)
    if (!match) throw new InvalidTryOnRequestError(`${name} must be a base64 JPG, PNG, or WebP image`)
    mimeType = match[1]
    bytes = Buffer.from(match[2], "base64")
  } else {
    let source: URL
    try {
      source = new URL(value, request.url)
    } catch {
      throw new InvalidTryOnRequestError(`${name} must be a valid image URL`)
    }
    const requestOrigin = new URL(request.url).origin
    if (source.username || source.password) {
      throw new InvalidTryOnRequestError(`${name} must be a valid image URL`)
    }
    if (source.origin !== requestOrigin) {
      if (source.protocol !== "https:" || isIP(source.hostname) !== 0) {
        throw new InvalidTryOnRequestError(`${name} must be a secure public image URL`)
      }
      await validateRemoteHost(source.hostname)
    } else if (source.pathname.startsWith("/api/") && source.pathname !== "/api/file") {
      throw new InvalidTryOnRequestError(`${name} must be an image URL`)
    }

    let response: Response
    try {
      response = await fetch(source, {
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
      })
    } catch {
      throw new InvalidTryOnRequestError(`Unable to load ${name}`)
    }
    if (!response.ok) throw new InvalidTryOnRequestError(`Unable to load ${name}`)

    mimeType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase()
    if (!IMAGE_TYPES.has(mimeType)) throw new InvalidTryOnRequestError(`${name} must be a JPG, PNG, or WebP image`)

    const contentLength = Number(response.headers.get("content-length"))
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_SIZE) {
      throw new InvalidTryOnRequestError(`${name} exceeds the 10MB image limit`)
    }
    try {
      bytes = await readLimited(response, MAX_IMAGE_SIZE, name)
    } catch {
      throw new InvalidTryOnRequestError(`${name} exceeds the 10MB image limit`)
    }
  }

  if (!IMAGE_TYPES.has(mimeType)) throw new InvalidTryOnRequestError(`${name} must be a JPG, PNG, or WebP image`)
  if (!bytes.length || bytes.length > MAX_IMAGE_SIZE) {
    throw new InvalidTryOnRequestError(`${name} exceeds the 10MB image limit`)
  }

  return { bytes, mimeType, filename: filenameForType(mimeType, name) }
}

async function uploadImage(image: ImageFile): Promise<GradioFile> {
  const formData = new FormData()
  formData.append("files", new Blob([new Uint8Array(image.bytes)], { type: image.mimeType }), image.filename)
  const response = await fetch(`${TRY_ON_SPACE_URL}/upload`, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(60_000),
  })
  if (!response.ok) throw new Error(`Image upload failed with status ${response.status}`)

  const uploaded: unknown = await response.json()
  if (!Array.isArray(uploaded) || typeof uploaded[0] !== "string") {
    throw new Error("The try-on service returned an invalid upload response")
  }
  return { path: uploaded[0] }
}

function parseOutputFile(value: unknown): GradioFile {
  if (!isRecord(value) || typeof value.path !== "string") {
    throw new Error("The try-on service returned no generated image")
  }
  return {
    path: value.path,
    ...(typeof value.url === "string" ? { url: value.url } : {}),
  }
}

async function generateTryOn(person: ImageFile, garment: ImageFile, description: string): Promise<string> {
  const [personFile, garmentFile] = await Promise.all([uploadImage(person), uploadImage(garment)])
  const response = await fetch(`${TRY_ON_SPACE_URL}/run/tryon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        { background: personFile, layers: [], composite: null },
        garmentFile,
        description,
        true,
        false,
        30,
        42,
      ],
    }),
    signal: AbortSignal.timeout(180_000),
  })
  if (!response.ok) throw new Error(`Try-on generation failed with status ${response.status}`)

  const result: unknown = await response.json()
  if (!isRecord(result) || !Array.isArray(result.data)) {
    throw new Error("The try-on service returned an invalid generation response")
  }

  const outputFile = parseOutputFile(result.data[0])
  const outputUrl = outputFile.url
    ? new URL(outputFile.url, TRY_ON_SPACE_URL)
    : new URL(`/file=${outputFile.path}`, TRY_ON_SPACE_URL)
  if (outputUrl.origin !== TRY_ON_SPACE_URL) throw new Error("The try-on service returned an invalid image URL")

  const imageResponse = await fetch(outputUrl, { signal: AbortSignal.timeout(30_000) })
  if (!imageResponse.ok) throw new Error("Unable to download the generated try-on image")
  const mimeType = (imageResponse.headers.get("content-type") || "").split(";")[0].trim().toLowerCase()
  if (!IMAGE_TYPES.has(mimeType)) throw new Error("The try-on service returned an unsupported image format")
  const bytes = await readLimited(imageResponse, MAX_IMAGE_SIZE, "Generated image")

  return `data:${mimeType};base64,${bytes.toString("base64")}`
}

function toDataUrl(image: ImageFile): string {
  return `data:${image.mimeType};base64,${image.bytes.toString("base64")}`
}

function parseDataUrl(value: unknown, providerName: string): string {
  if (typeof value !== "string") throw new Error(`${providerName} returned no image`)
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/)
  if (!match) throw new Error(`${providerName} returned an unsupported image format`)
  const bytes = Buffer.from(match[2], "base64")
  if (!bytes.length || bytes.length > MAX_IMAGE_SIZE) throw new Error(`${providerName} returned an invalid image size`)
  return value
}

async function generateSelfHostedModel(
  endpoint: string | undefined,
  providerName: string,
  input: TryOnInput,
): Promise<string> {
  if (!endpoint) throw new Error(`${providerName} endpoint is not configured`)
  const form = new FormData()
  form.append("person", new Blob([new Uint8Array(input.person.bytes)], { type: input.person.mimeType }), input.person.filename)
  form.append("garment", new Blob([new Uint8Array(input.garment.bytes)], { type: input.garment.mimeType }), input.garment.filename)
  form.append("category", input.category)
  form.append("description", input.description)

  const response = await fetch(endpoint, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(180_000),
  })
  if (!response.ok) throw new Error(`${providerName} returned HTTP ${response.status}`)

  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase()
  if (IMAGE_TYPES.has(contentType)) {
    const bytes = await readLimited(response, MAX_IMAGE_SIZE, `${providerName} result`)
    if (!bytes.length) throw new Error(`${providerName} returned an empty image`)
    return `data:${contentType};base64,${bytes.toString("base64")}`
  }
  if (!contentType.includes("json")) throw new Error(`${providerName} returned an unsupported response`)
  const result: unknown = await response.json()
  if (!isRecord(result)) throw new Error(`${providerName} returned an invalid response`)
  return parseDataUrl(result.image, providerName)
}

async function generateFashnModel(modelName: "tryon-v1.6" | "tryon-max", input: TryOnInput): Promise<string> {
  const apiKey = process.env.FASHN_API_KEY
  if (!apiKey) throw new Error("FASHN API key is not configured")

  const category = /dress|jumpsuit|one-piece/i.test(input.category)
    ? "one-pieces"
    : /pant|bottom|jean|skirt|short/i.test(input.category)
      ? "bottoms"
      : /top|shirt|blouse|sweater|jacket|coat/i.test(input.category)
        ? "tops"
        : "auto"

  const startResponse = await fetch("https://api.fashn.ai/v1/run", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: modelName,
      inputs: {
        model_image: toDataUrl(input.person),
        garment_image: toDataUrl(input.garment),
        category,
        return_base64: true,
        num_samples: 1,
      },
    }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!startResponse.ok) throw new Error(`${modelName} returned HTTP ${startResponse.status}`)

  const started: unknown = await startResponse.json()
  if (!isRecord(started) || typeof started.id !== "string") {
    throw new Error(`${modelName} returned an invalid prediction id`)
  }

  for (let attempt = 0; attempt < 90; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 2_000))
    const statusResponse = await fetch(
      `https://api.fashn.ai/v1/status/${encodeURIComponent(started.id)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    )
    if (!statusResponse.ok) throw new Error(`${modelName} status request returned HTTP ${statusResponse.status}`)
    const status: unknown = await statusResponse.json()
    if (!isRecord(status)) throw new Error(`${modelName} returned an invalid status response`)

    if (status.status === "failed") throw new Error(`${modelName} prediction failed`)
    if (status.status !== "completed") continue
    if (!Array.isArray(status.output) || typeof status.output[0] !== "string") {
      throw new Error(`${modelName} returned no generated image`)
    }

    const output = status.output[0]
    if (output.startsWith("data:")) return parseDataUrl(output, modelName)
    const outputUrl = new URL(output)
    if (
      outputUrl.protocol !== "https:" ||
      !["cdn.fashn.ai", "media.fashn.ai"].includes(outputUrl.hostname)
    ) {
      throw new Error(`${modelName} returned an invalid image URL`)
    }
    const imageResponse = await fetch(outputUrl, {
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    })
    if (!imageResponse.ok) throw new Error(`Unable to download the ${modelName} image`)
    const mimeType = (imageResponse.headers.get("content-type") || "").split(";")[0].trim().toLowerCase()
    if (!IMAGE_TYPES.has(mimeType)) throw new Error(`${modelName} returned an unsupported image format`)
    const bytes = await readLimited(imageResponse, MAX_IMAGE_SIZE, `${modelName} result`)
    return `data:${mimeType};base64,${bytes.toString("base64")}`
  }

  throw new Error(`${modelName} prediction timed out`)
}

const providers: TryOnProvider[] = [
  {
    id: "idm-vton",
    name: "IDM-VTON public demo",
    tier: "free",
    enabled: () => process.env.TRYON_ENABLE_PUBLIC_IDM_VTON !== "false",
    generate: ({ person, garment, description }) => generateTryOn(person, garment, description),
  },
  {
    id: "catvton",
    name: "CatVTON (self-hosted)",
    tier: "free",
    enabled: () => Boolean(process.env.TRYON_CATVTON_URL),
    generate: (input) => generateSelfHostedModel(process.env.TRYON_CATVTON_URL, "CatVTON", input),
  },
  {
    id: "ootdiffusion",
    name: "OOTDiffusion (self-hosted)",
    tier: "free",
    enabled: () => Boolean(process.env.TRYON_OOTDIFFUSION_URL),
    generate: (input) => generateSelfHostedModel(process.env.TRYON_OOTDIFFUSION_URL, "OOTDiffusion", input),
  },
  {
    id: "kolors-vton",
    name: "Kolors Virtual Try-On (self-hosted)",
    tier: "free",
    enabled: () => Boolean(process.env.TRYON_KOLORS_URL),
    generate: (input) => generateSelfHostedModel(process.env.TRYON_KOLORS_URL, "Kolors Virtual Try-On", input),
  },
  {
    id: "fashn-v1.6",
    name: "FASHN Try-On v1.6",
    tier: "paid",
    enabled: () => Boolean(process.env.FASHN_API_KEY) && process.env.TRYON_ENABLE_PAID_FALLBACK === "true",
    generate: (input) => generateFashnModel("tryon-v1.6", input),
  },
  {
    id: "fashn-max",
    name: "FASHN Try-On Max",
    tier: "paid",
    enabled: () => Boolean(process.env.FASHN_API_KEY) && process.env.TRYON_ENABLE_PAID_FALLBACK === "true",
    generate: (input) => generateFashnModel("tryon-max", input),
  },
]

function listProviders() {
  return providers.map(({ id, name, tier, enabled }) => ({ id, name, tier, enabled: enabled() }))
}

async function generateWithFallback(input: TryOnInput) {
  const attempted: string[] = []
  let lastError: unknown

  for (const provider of providers) {
    if (!provider.enabled()) continue
    attempted.push(provider.id)
    try {
      return { url: await provider.generate(input), provider: provider.id, attemptedProviders: attempted }
    } catch (error) {
      lastError = error
      console.warn(`[try-on] Provider ${provider.id} failed; trying next configured provider`)
    }
  }

  if (attempted.length === 0) throw new Error("No try-on providers are enabled")
  throw lastError instanceof Error ? lastError : new Error("All configured try-on providers failed")
}

export async function GET() {
  return NextResponse.json({ success: true, data: { providers: listProviders() }, error: null })
}

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, data: null, error: "Request body must be valid JSON." },
        { status: 400 },
      )
    }
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: null, error: "Both valid image URLs are required; only front view is currently supported." },
        { status: 400 },
      )
    }

    const [person, garment] = await Promise.all([
      loadImage(parsed.data.userPhotoUrl, request, "person"),
      loadImage(parsed.data.itemImageUrl, request, "garment"),
    ])
    const category = parsed.data.category || "clothing"
    const result = await generateWithFallback({
      person,
      garment,
      category,
      description: parsed.data.itemDescription || category,
    })
    return NextResponse.json({
      success: true,
      data: { url: result.url, provider: result.provider, attemptedProviders: result.attemptedProviders },
      url: result.url,
      error: null,
    })
  } catch (error) {
    if (error instanceof InvalidTryOnRequestError) {
      return NextResponse.json({ success: false, data: null, error: error.message }, { status: 400 })
    }
    console.error("[try-on] All configured providers failed", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error && error.message === "No try-on providers are enabled"
          ? "No try-on provider is configured. Configure an enabled provider and try again."
          : "All configured try-on providers are unavailable. Please try again later.",
      },
      { status: error instanceof Error && error.message === "No try-on providers are enabled" ? 503 : 502 },
    )
  }
}

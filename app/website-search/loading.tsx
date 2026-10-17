import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <h3 className="mt-4 text-lg font-medium">Loading search...</h3>
      </div>
    </div>
  )
}


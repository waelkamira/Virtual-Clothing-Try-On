import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  progress?: number
  showProgress?: boolean
  className?: string
}

export function Loading({ size = "md", progress, showProgress = false, className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("rounded-full border-orange-500/30 border-t-orange-500 animate-spin", sizeClasses[size])} />

      {showProgress && typeof progress === "number" && (
        <div className="mt-4 w-full max-w-xs">
          <div className="text-xs text-center mb-1 text-muted-foreground">{Math.round(progress)}%</div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}


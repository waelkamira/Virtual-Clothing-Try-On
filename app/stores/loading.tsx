import { Skeleton } from "@/components/ui/skeleton"

export default function StoresLoading() {
  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <Skeleton className="h-8 w-48 mb-6" />

      {/* Search bar skeleton */}
      <Skeleton className="w-full h-12 mb-6 rounded-xl" />

      {/* Popular stores skeleton */}
      <Skeleton className="h-6 w-36 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-5 h-5" />
              </div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="w-full h-9 rounded-lg" />
            </div>
          ))}
      </div>

      {/* All stores skeleton */}
      <Skeleton className="h-6 w-24 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-5 h-5" />
              </div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="w-full h-9 rounded-lg" />
            </div>
          ))}
      </div>
    </div>
  )
}


import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl border border-border/40 p-8 bg-card/30">
        <Skeleton className="h-6 w-32 rounded-full mb-3" />
        <Skeleton className="h-9 w-64 rounded-xl mb-2" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card/40 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-14 rounded-lg" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border/50 bg-card/40 space-y-4">
          <Skeleton className="h-6 w-40 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl border border-border/40 bg-background/50 p-4 space-y-3">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-border/50 bg-card/40 space-y-3">
          <Skeleton className="h-6 w-32 rounded" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl border border-border/40 bg-background/50 p-3 space-y-2">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

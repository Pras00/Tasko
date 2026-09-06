import { Skeleton } from "@/components/ui/skeleton"

export default function KanbanLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Link Skeleton */}
      <Skeleton className="h-4 w-28 rounded" />

      {/* Project Header Skeleton */}
      <div className="rounded-3xl border border-border/50 bg-card/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-8 w-60 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-96 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="h-14 rounded-2xl border border-border/40 bg-card/30 flex items-center px-4 justify-between">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      {/* 4 Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="rounded-2xl border border-border/50 bg-muted/20 p-4 min-h-[420px] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            {[1, 2].map((card) => (
              <div key={card} className="h-28 rounded-2xl border border-border/40 bg-card/60 p-3.5 space-y-2.5">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

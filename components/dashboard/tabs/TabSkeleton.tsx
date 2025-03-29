import { Skeleton } from "@/components/ui/skeleton";

interface TabSkeletonProps {
  type: "overview" | "monitoring" | "analytics";
}

export function TabSkeleton({ type }: TabSkeletonProps) {
  return (
    <div className="animate-tab-fade-in duration-300 ease-in-out">
      {type === "overview" && <OverviewSkeleton />}
      {type === "monitoring" && <MonitoringSkeleton />}
      {type === "analytics" && <AnalyticsSkeleton />}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32 bg-gradient-to-r from-muted/70 via-muted to-muted/70" />
        <Skeleton className="h-9 w-24 bg-gradient-to-r from-muted/70 via-muted to-muted/70" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-36 w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px] w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60" />
        <Skeleton
          className="h-[300px] w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60"
          style={{ animationDelay: "100ms" }}
        />
      </div>
    </div>
  );
}

function MonitoringSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-36 bg-gradient-to-r from-muted/70 via-muted to-muted/70" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-20 bg-gradient-to-r from-muted/70 via-muted to-muted/70" />
          <Skeleton
            className="h-9 w-20 bg-gradient-to-r from-muted/70 via-muted to-muted/70"
            style={{ animationDelay: "50ms" }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60"
            style={{ animationDelay: `${i * 75}ms` }}
          />
        ))}
      </div>

      <Skeleton className="h-[350px] w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60" />

      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-16 w-full rounded-md bg-gradient-to-r from-muted/70 via-muted to-muted/70"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40 bg-gradient-to-r from-muted/70 via-muted to-muted/70" />
        <Skeleton className="h-9 w-32 bg-gradient-to-r from-muted/70 via-muted to-muted/70" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-20 w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60"
            style={{ animationDelay: `${i * 75}ms` }}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px] w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60" />
        <Skeleton
          className="h-[300px] w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60"
          style={{ animationDelay: "100ms" }}
        />
      </div>

      <Skeleton className="h-[400px] w-full rounded-lg bg-gradient-to-br from-muted/60 via-muted/80 to-muted/60" />
    </div>
  );
}

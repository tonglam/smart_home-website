import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSkeletonProps {
  type?: "full" | "content";
}

/**
 * DashboardSkeleton - Server Component
 * Provides consistent loading states across the dashboard
 * Can be used for both full page and content-only loading states
 */
export function DashboardSkeleton({
  type = "content",
}: DashboardSkeletonProps) {
  const Content = (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );

  if (type === "content") {
    return Content;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Welcome Banner Skeleton */}
        <div className="w-full p-6 bg-card rounded-lg shadow-sm">
          <Skeleton className="h-8 w-1/3" />
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b space-x-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-24 inline-block" />
          ))}
        </div>

        {/* Content Skeleton */}
        {Content}
      </div>
    </div>
  );
}

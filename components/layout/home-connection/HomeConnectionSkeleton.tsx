import { Skeleton } from "@/components/ui/skeleton";

export function HomeConnectionSkeleton() {
  return (
    <div className="w-full px-4 border-b">
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" /> {/* Icon skeleton */}
          <Skeleton className="h-9 w-32" /> {/* Text skeleton */}
        </div>
      </div>
    </div>
  );
}

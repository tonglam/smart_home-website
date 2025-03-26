import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TabLoadingFallback() {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-8 w-[180px]" />
            <Skeleton className="h-4 w-[160px]" />
          </Card>
        ))}
      </div>
    </Card>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

export const TabLoading = memo(() => (
  <div className="space-y-4" aria-busy="true" role="status">
    <Card className="p-4">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
        </div>
      </div>
    </Card>
    <Card className="p-4">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </Card>
    <span className="sr-only">Loading dashboard content...</span>
  </div>
));

TabLoading.displayName = "TabLoading";

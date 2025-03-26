"use client";

import { Card } from "@/components/ui/card";
import { memo } from "react";

export const TabLoading = memo(() => (
  <Card className="p-4" aria-busy="true" role="status">
    <div className="h-32 animate-pulse bg-muted rounded-md">
      <span className="sr-only">Loading content...</span>
    </div>
  </Card>
));

TabLoading.displayName = "TabLoading";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { DeviceHealthCard } from "./device/DeviceHealthCard";
import { DeviceModeUsageChart } from "./device/DeviceModeUsageChart";

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="mt-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <div className="grid gap-6">
            <DeviceModeUsageChart className="lg:col-span-1" />
            <DeviceHealthCard className="lg:col-span-1" />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

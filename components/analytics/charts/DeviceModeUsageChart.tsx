"use client";

import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/ui/charts/LineChart";
import { useDeviceAnalytics } from "@/hooks";

interface DeviceModeUsageChartProps {
  className?: string;
}

export function DeviceModeUsageChart({ className }: DeviceModeUsageChartProps) {
  const { data, isLoading, error } = useDeviceAnalytics();

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="p-6 flex items-center justify-center">
          <div className="h-[300px] w-full animate-pulse bg-muted rounded" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6 flex items-center justify-center text-muted-foreground">
          Failed to load device usage data
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Device Mode Usage</h3>
        <div className="h-[300px]">
          <LineChart
            data={data}
            xAxis="timestamp"
            yAxis="away"
            categories={["away", "movie", "learning"]}
          />
        </div>
      </div>
    </Card>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";
import { useSecurityAnalytics } from "@/hooks";

interface SecurityEventsChartProps {
  className?: string;
}

export function SecurityEventsChart({ className }: SecurityEventsChartProps) {
  const { data, isLoading, error } = useSecurityAnalytics();

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
          Failed to load security events data
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security Events</h3>
        <div className="h-[300px]">
          <BarChart
            data={data}
            xAxis="timestamp"
            yAxis="alerts"
            categories={["alerts", "warnings", "info"]}
          />
        </div>
      </div>
    </Card>
  );
}

"use client";

import { DeviceUsageAnalytics } from "@/components/analytics/charts";

interface DeviceModeUsageChartProps {
  className?: string;
}

export function DeviceModeUsageChart({ className }: DeviceModeUsageChartProps) {
  return <DeviceUsageAnalytics className={className} />;
}

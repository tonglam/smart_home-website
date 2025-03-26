"use client";

import { DeviceModeUsageChart as OptimizedDeviceModeUsageChart } from "@/components/analytics/charts";

interface DeviceModeUsageChartProps {
  className?: string;
}

export function DeviceModeUsageChart(props: DeviceModeUsageChartProps) {
  return <OptimizedDeviceModeUsageChart {...props} />;
}

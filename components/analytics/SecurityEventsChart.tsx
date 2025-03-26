"use client";

import { SecurityEventAnalytics } from "@/components/analytics/charts";

interface SecurityEventsChartProps {
  className?: string;
}

export function SecurityEventsChart({ className }: SecurityEventsChartProps) {
  return <SecurityEventAnalytics className={className} />;
}

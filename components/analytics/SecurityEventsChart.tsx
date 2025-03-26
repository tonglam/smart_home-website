"use client";

import { SecurityEventsChart as OptimizedSecurityEventsChart } from "@/components/analytics/charts";

interface SecurityEventsChartProps {
  className?: string;
}

export function SecurityEventsChart(props: SecurityEventsChartProps) {
  return <OptimizedSecurityEventsChart {...props} />;
}

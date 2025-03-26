"use client";

import {
  Bar,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  timestamp: string;
  auto?: number;
  manual?: number;
  schedule?: number;
  alerts?: number;
  warnings?: number;
  info?: number;
}

interface BarChartProps {
  data: ChartDataPoint[];
  xAxis: keyof ChartDataPoint;
  yAxis: keyof ChartDataPoint;
  categories: string[];
}

export function BarChart({ data, xAxis, yAxis, categories }: BarChartProps) {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
      >
        <XAxis
          dataKey={xAxis}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey={yAxis}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category.toLowerCase()}
            name={category}
            fill={COLORS[index % COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

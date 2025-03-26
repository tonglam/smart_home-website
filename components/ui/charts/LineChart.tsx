"use client";

import {
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  timestamp: string;
  away?: number;
  movie?: number;
  learning?: number;
  alerts?: number;
  warnings?: number;
  info?: number;
}

interface LineChartProps {
  data: ChartDataPoint[];
  xAxis: keyof ChartDataPoint;
  yAxis: keyof ChartDataPoint;
  categories: string[];
}

export function LineChart({ data, xAxis, yAxis, categories }: LineChartProps) {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
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
          <Line
            key={category}
            type="monotone"
            dataKey={category.toLowerCase()}
            name={category}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

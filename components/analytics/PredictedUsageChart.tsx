'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { predictedUsageData } from "@/lib/mockChartData";
import { TrendingUp } from "lucide-react";

interface PredictedUsageChartProps {
  className?: string;
}

export function PredictedUsageChart({ className }: PredictedUsageChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <CardTitle className="text-base font-medium">Predicted vs Actual</CardTitle>
          </div>
          <CardDescription>
            AI-powered usage predictions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={predictedUsageData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${value} kWh`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value} kWh`, ""]}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
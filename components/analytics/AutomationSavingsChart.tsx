'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { automationSavingsData } from "@/lib/mockChartData";
import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AutomationSavingsChartProps {
  className?: string;
}

export function AutomationSavingsChart({ className }: AutomationSavingsChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Automation Savings</CardTitle>
          <CardDescription>
            Energy savings through automation
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            <span>29% Savings</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={automationSavingsData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, ""]}
              />
              <Legend />
              <Bar 
                dataKey="manual" 
                name="Without Automation" 
                fill="hsl(var(--chart-4))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="automated" 
                name="With Automation" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
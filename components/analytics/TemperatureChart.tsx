'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { temperatureData } from "@/lib/mockChartData";
import { Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemperatureChartProps {
  className?: string;
}

export function TemperatureChart({ className }: TemperatureChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Temperature Monitoring</CardTitle>
          <CardDescription>
            Temperature trends across different rooms
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Thermometer className="h-3 w-3" />
            <span>Past 24 Hours</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={temperatureData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${value}°C`}
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value}°C`, ""]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="livingRoom"
                name="Living Room"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="bedroom"
                name="Bedroom"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="kitchen"
                name="Kitchen"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="outside"
                name="Outside"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Living Room', value: '23.0°C', trend: '+0.5°C', color: 'var(--chart-1)' },
            { name: 'Bedroom', value: '21.8°C', trend: '-0.2°C', color: 'var(--chart-2)' },
            { name: 'Kitchen', value: '22.0°C', trend: '-0.8°C', color: 'var(--chart-3)' },
            { name: 'Outside', value: '17.5°C', trend: '-3.3°C', color: 'var(--chart-4)' },
          ].map((item) => (
            <Card key={item.name} className="p-2 border border-border/50 bg-card/50">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.value}</span>
                  <span className="text-xs" style={{ color: `hsl(${item.color})` }}>{item.trend}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
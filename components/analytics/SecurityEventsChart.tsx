'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { securityEventsData } from "@/lib/mockChartData";
import { Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SecurityEventsChartProps {
  className?: string;
}

export function SecurityEventsChart({ className }: SecurityEventsChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <CardTitle className="text-base font-medium">Security Events</CardTitle>
          </div>
          <CardDescription>
            Track and analyze security-related events
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30days">
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={securityEventsData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="motionAlerts" 
                name="Motion Alerts" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="doorEvents" 
                name="Door Events" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="windowEvents" 
                name="Window Events" 
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Card className="p-2 border border-border/50 bg-card/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Events</span>
              <span className="text-lg font-semibold">63</span>
            </div>
          </Card>
          <Card className="p-2 border border-border/50 bg-card/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Most Active</span>
              <span className="text-sm font-medium">Front Door</span>
            </div>
          </Card>
          <Card className="p-2 border border-border/50 bg-card/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Alert Rate</span>
              <span className="text-sm font-medium">2.1/day</span>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
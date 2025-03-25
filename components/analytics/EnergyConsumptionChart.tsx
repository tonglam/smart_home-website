"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { energyConsumptionData, hourlyEnergyData } from "@/lib/mockChartData";
import { Zap } from "lucide-react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EnergyConsumptionChartProps {
  className?: string;
}

export function EnergyConsumptionChart({
  className,
}: EnergyConsumptionChartProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Energy Consumption
          </CardTitle>
          <CardDescription>
            Track your smart home&apos;s energy usage and costs
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="7days">
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={energyConsumptionData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => `${value} kWh`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "consumption")
                        return [`${value} kWh`, "Energy Used"];
                      if (name === "cost")
                        return [formatCurrency(value), "Cost"];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="consumption"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3 border border-border/50 bg-card/50">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Total Energy
                  </span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-chart-1" />
                    <span className="text-lg font-semibold">43.8 kWh</span>
                  </div>
                </div>
              </Card>
              <Card className="p-3 border border-border/50 bg-card/50">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Estimated Cost
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold">$13.14</span>
                  </div>
                </div>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground">
              You&apos;ve saved 12% compared to last month
            </p>
          </TabsContent>
          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={hourlyEnergyData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `${value} kWh`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} kWh`, "Energy Used"]}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

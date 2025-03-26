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
import { securityEventsData } from "@/lib/mockChartData";
import { FaShieldAlt } from "react-icons/fa";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Chart title with icon component
const ChartHeader = () => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <FaShieldAlt className="h-4 w-4" />
      <CardTitle className="text-base font-medium">Security Events</CardTitle>
    </div>
    <CardDescription>Track and analyze security-related events</CardDescription>
  </div>
);

// Time period selector component
const PeriodSelector = () => (
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
);

// Bar chart component
const EventsBarChart = () => (
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
);

// Statistical card component
const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="p-2 border border-border/50 bg-card/50">
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{title}</span>
      <span
        className={
          title === "Total Events"
            ? "text-lg font-semibold"
            : "text-sm font-medium"
        }
      >
        {value}
      </span>
    </div>
  </Card>
);

// Stats summary component
const StatsSummary = () => (
  <div className="mt-2 grid grid-cols-3 gap-2">
    <StatCard title="Total Events" value="63" />
    <StatCard title="Most Active" value="Front Door" />
    <StatCard title="Alert Rate" value="2.1/day" />
  </div>
);

// Main component
interface SecurityEventsChartProps {
  className?: string;
}

export function SecurityEventsChart({ className }: SecurityEventsChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <ChartHeader />
        <PeriodSelector />
      </CardHeader>
      <CardContent>
        <EventsBarChart />
        <StatsSummary />
      </CardContent>
    </Card>
  );
}

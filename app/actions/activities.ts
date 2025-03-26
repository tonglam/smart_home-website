"use server";

import { Activity } from "@/components/dashboard/activities/types";

export async function getRecentActivities(): Promise<Activity[]> {
  // Mock data for now
  return [
    {
      id: "1",
      title: "Front Door Unlocked",
      description: "Front door was unlocked via smart lock",
      timestamp: "2 minutes ago",
      type: "security",
      severity: "low",
    },
    {
      id: "2",
      title: "Motion Detected",
      description: "Motion detected in backyard",
      timestamp: "15 minutes ago",
      type: "security",
      severity: "medium",
    },
    {
      id: "3",
      title: "Temperature Adjusted",
      description: "Living room temperature set to 72°F",
      timestamp: "1 hour ago",
      type: "device",
    },
    {
      id: "4",
      title: "Night Mode Activated",
      description: "Home automation switched to night mode",
      timestamp: "3 hours ago",
      type: "automation",
    },
  ];
}

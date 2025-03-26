"use server";

export interface Activity {
  id: string;
  type: "device" | "security" | "system";
  action: string;
  target: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export async function getRecentActivities(): Promise<Activity[]> {
  // Mock data for now
  const mockActivities: Activity[] = [
    {
      id: "1",
      type: "device",
      action: "turned on",
      target: "Living Room Light",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      status: "success",
    },
    {
      id: "2",
      type: "security",
      action: "detected motion",
      target: "Front Door Camera",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      status: "warning",
    },
    {
      id: "3",
      type: "system",
      action: "firmware update",
      target: "Smart Hub",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: "success",
    },
    {
      id: "4",
      type: "device",
      action: "failed to respond",
      target: "Garage Door",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      status: "error",
    },
    {
      id: "5",
      type: "security",
      action: "armed",
      target: "Home Security System",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      status: "success",
    },
  ];

  return mockActivities;
}

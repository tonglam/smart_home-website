export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "device" | "security" | "automation";
  severity?: "low" | "medium" | "high";
}

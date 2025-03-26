"use server";

import { defaultAutomationModes } from "@/lib/data";

export type AutomationMode = {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  description: string;
};

export async function getAutomationModes(): Promise<AutomationMode[]> {
  try {
    // This is using mock data for now
    // In a real application, you would fetch from a database
    return defaultAutomationModes;
  } catch (error) {
    console.error("Error fetching automation modes:", error);
    return [];
  }
}

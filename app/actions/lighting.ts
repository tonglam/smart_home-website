"use server";

import { defaultLights } from "@/lib/data";

export type Light = {
  id: string;
  name: string;
  isOn: boolean;
  brightness: number;
  temperature: number;
  room: string;
};

export async function getLightingData(): Promise<Light[]> {
  try {
    // This is using mock data for now
    // In a real application, you would fetch from a database
    return defaultLights;
  } catch (error) {
    console.error("Error fetching lighting data:", error);
    return [];
  }
}

"use server";

import { securityPoints } from "@/lib/data";

export type SecurityPoint = {
  id: string;
  name: string;
  type: string;
  status: string;
  lastActivity: string;
};

export async function getSecurityPoints(): Promise<SecurityPoint[]> {
  try {
    // This is using mock data for now
    // In a real application, you would fetch from a database
    return securityPoints;
  } catch (error) {
    console.error("Error fetching security points:", error);
    return [];
  }
}

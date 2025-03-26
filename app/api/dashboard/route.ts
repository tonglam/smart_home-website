import { getCriticalAlerts } from "@/app/actions/critical-alerts";
import { getDevicesByType } from "@/app/actions/devices";
import { getRecentEvents } from "@/app/actions/events";
import { getSecurityPoints } from "@/app/actions/security";
import * as db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId");

  if (!homeId) {
    return NextResponse.json({ error: "Missing homeId" }, { status: 400 });
  }

  try {
    // Fetch multiple data types in parallel
    const [lightDevices, alerts, events, securityPoints] = await Promise.all([
      getDevicesByType(homeId, "light"),
      getCriticalAlerts(homeId),
      getRecentEvents(homeId, 20),
      getSecurityPoints(homeId),
    ]);

    // Get all devices from db directly
    const allDevices = await db.getDevices(homeId);

    return NextResponse.json({
      devices: allDevices,
      lightDevices,
      alerts,
      events,
      securityPoints,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

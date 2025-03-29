import { fetchDevicesByHomeId } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ homeId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { homeId } = await params;
    const devices = await fetchDevicesByHomeId(homeId);

    return Response.json(
      { data: devices },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("[DEVICES_GET]", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

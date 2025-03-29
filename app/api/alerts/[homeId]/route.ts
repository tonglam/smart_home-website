import { fetchAlertsByHomeId } from "@/db/db";
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
    const alerts = await fetchAlertsByHomeId(homeId);

    return Response.json(
      { data: alerts },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
        },
      }
    );
  } catch (error) {
    console.error("[ALERTS_GET]", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

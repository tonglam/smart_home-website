import { fetchAlertsByHomeId, createAlert } from "@/db/db";
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ homeId: string }> }
) {
  try {
    const { homeId } = await params;
    const body = await request.json();

    // Insert the alert into the database
    const result = await createAlert({
      homeId,
      userId: body.userId || "system",
      deviceId: body.deviceId,
      message: body.message || "Critical alert!",
      sentStatus: false,
      dismissed: false,
      createdAt: body.timestamp ? new Date(body.timestamp) : new Date(),
    });

    if (result.success) {
      return Response.json({ status: "ok" }, { status: 200 });
    } else {
      return Response.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("[ALERTS_POST]", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

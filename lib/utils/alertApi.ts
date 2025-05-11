export async function postAlertToApi(alert: {
  homeId: string;
  type: string;
  message: string;
  deviceName: string;
  timestamp: string;
  deviceId?: string;
}) {
  const res = await fetch(`/api/alerts/${alert.homeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: alert.type,
      message: alert.message,
      source: alert.deviceName,
      timestamp: alert.timestamp,
      deviceId: alert.deviceId,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to save alert to database");
  }
  return res.json();
} 
"use server";

interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
}

export async function getDevices(): Promise<Device[]> {
  // TODO: Replace with actual DB query
  return [
    { id: "1", name: "Living Room Light", type: "Light", status: "online" },
    { id: "2", name: "Kitchen Camera", type: "Camera", status: "offline" },
    { id: "3", name: "Front Door Lock", type: "Lock", status: "online" },
  ];
}

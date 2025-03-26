"use client";

import { getDevices } from "@/app/actions/devices";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
}

export function SmartHomeGridOptimized() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = (await getDevices()) as Device[];
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device: Device) => (
        <Card key={device.id} className="p-4">
          <h3 className="font-medium">{device.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{device.type}</p>
          <div className="mt-4">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                device.status === "online"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {device.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

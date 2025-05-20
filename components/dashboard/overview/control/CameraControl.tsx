"use client";

import { Switch } from "@/components/ui/switch";
import { useCamera } from "@/hooks/dashboard/useCamera";
import type { Camera } from "@/types";
import { Video } from "lucide-react";
import { useEffect, useState } from "react";

interface CameraControlProps {
  camera: Camera;
  homeId: string;
}

export function CameraControl({ camera, homeId }: CameraControlProps) {
  const [localStatus, setLocalStatus] = useState<"online" | "offline">(
    camera.status
  );

  const { toggleCamera: sdkToggleCamera, pendingUpdates } = useCamera(homeId, [
    camera,
  ]);
  const isPending = pendingUpdates.includes(camera.id);

  useEffect(() => {
    setLocalStatus(camera.status);
  }, [camera.status]);

  const handleToggle = () => {
    if (isPending) return;

    const newStatusForUI: "online" | "offline" =
      localStatus === "online" ? "offline" : "online";
    setLocalStatus(newStatusForUI);

    sdkToggleCamera(camera.id);
  };

  const isChecked = localStatus === "online";

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video
            className={`h-4 w-4 ${
              isChecked ? "text-blue-500" : "text-muted-foreground"
            }`}
          />
          <span className="font-medium">{camera.name}</span>
        </div>
        <Switch
          checked={isChecked}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-blue-500"
          disabled={isPending}
        />
      </div>
    </div>
  );
}

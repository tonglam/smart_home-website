"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Light } from "@/types/dashboard.types";
import { Lightbulb, Video } from "lucide-react";
import { CameraControl } from "./CameraControl";
import { LightControl } from "./LightControl";

export interface ControlSectionProps {
  lightDevices: Light[];
  cameraDevices: Camera[];
  homeId: string;
}

export function ControlSection({
  lightDevices,
  cameraDevices,
  homeId,
}: ControlSectionProps) {
  const hasLights = lightDevices && lightDevices.length > 0;
  const hasCameras = cameraDevices && cameraDevices.length > 0;

  if (!hasLights && !hasCameras) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {hasLights && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Lightbulb className="h-5 w-5" />
              Lighting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...lightDevices]
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((light) => (
                <LightControl key={light.id} light={light} homeId={homeId} />
              ))}
          </CardContent>
        </Card>
      )}

      <Separator className="my-5" />

      {hasCameras && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Video className="h-5 w-5" />
              Cameras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...cameraDevices]
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((camera) => (
                <CameraControl
                  key={camera.id}
                  camera={camera}
                  homeId={homeId}
                />
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

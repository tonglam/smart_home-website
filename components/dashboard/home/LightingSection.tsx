"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLighting } from "@/hooks/dashboard/useLighting";
import { Lightbulb } from "lucide-react";
import { LightControl } from "./components/LightControl";

export interface LightingSectionProps {
  isConnected: boolean;
}

export function LightingSection({ isConnected }: LightingSectionProps) {
  const {
    lights,
    isLoading,
    error,
    toggleLight,
    adjustBrightness,
    adjustTemperature,
  } = useLighting();

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Lightbulb className="h-5 w-5" />
            Lighting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">
            Error loading lighting data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Lightbulb className="h-5 w-5" />
          Lighting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[140px] w-full rounded-lg" />
            <Skeleton className="h-[140px] w-full rounded-lg" />
          </>
        ) : (
          lights.map((light) => (
            <LightControl
              key={light.id}
              light={light}
              isConnected={isConnected}
              onToggle={() => toggleLight(light.id)}
              onBrightnessChange={(value) => adjustBrightness(light.id, value)}
              onTemperatureChange={(value) =>
                adjustTemperature(light.id, value)
              }
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

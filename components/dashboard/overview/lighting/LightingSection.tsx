"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Light } from "@/types/dashboard.types";
import { Lightbulb } from "lucide-react";
import { LightControl } from "./LightControl";

export interface LightingSectionProps {
  lightDevices: Light[];
  homeId: string;
}

export function LightingSection({
  lightDevices,
  homeId,
}: LightingSectionProps) {
  if (!lightDevices?.length) {
    return null;
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
        {[...lightDevices]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((light) => (
            <LightControl key={light.id} light={light} homeId={homeId} />
          ))}
      </CardContent>
    </Card>
  );
}

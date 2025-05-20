"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLighting } from "@/hooks/dashboard/useLighting";
import type { Light } from "@/types";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

interface LightControlProps {
  light: Light;
  homeId: string;
}

const deriveDisplayBrightness = (
  isOn: boolean,
  brightnessValue: number
): number => {
  if (!isOn) return 0;
  if (brightnessValue === 100) return 100;
  return 10;
};

export function LightControl({ light, homeId }: LightControlProps) {
  const [localIsOn, setLocalIsOn] = useState(light.isOn);
  const [localBrightness, setLocalBrightness] = useState(() =>
    deriveDisplayBrightness(light.isOn, light.brightness)
  );

  const { adjustBrightness, pendingUpdates } = useLighting(homeId, [light]);
  const isPending = pendingUpdates.includes(light.id);

  useEffect(() => {
    if (isPending) {
      return;
    }

    setLocalIsOn(light.isOn);
    setLocalBrightness(deriveDisplayBrightness(light.isOn, light.brightness));
  }, [light.isOn, light.brightness, isPending]);

  const handleToggle = () => {
    if (isPending) return;
    const newIsOn = !localIsOn;
    if (newIsOn) {
      setLocalIsOn(true);
      setLocalBrightness(100);
      adjustBrightness(light.id, 100);
    } else {
      setLocalIsOn(false);
      setLocalBrightness(0);
      adjustBrightness(light.id, 0);
    }
  };
  const handleSetPreset = (level: 10 | 100) => {
    if (isPending) return;
    setLocalIsOn(true);
    setLocalBrightness(level);
    adjustBrightness(light.id, level);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col justify-between min-h-[150px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb
              className={`h-4 w-4 ${
                localIsOn ? "text-yellow-400" : "text-muted-foreground"
              }`}
            />
            <span className="font-medium">{light.name}</span>
          </div>
          <Switch
            checked={localIsOn}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-yellow-400"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="mt-auto">
        {localIsOn && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Brightness:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={localBrightness === 10 ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSetPreset(10)}
                disabled={isPending}
              >
                Weak
              </Button>
              <Button
                variant={localBrightness === 100 ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSetPreset(100)}
                disabled={isPending}
              >
                Bright
              </Button>
            </div>
          </div>
        )}
        {!localIsOn && (
          <div className="space-y-2 invisible pointer-events-none">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Brightness:</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="w-full" disabled>
                Weak
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Bright
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

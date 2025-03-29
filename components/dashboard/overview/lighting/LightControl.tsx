"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useLighting } from "@/hooks/dashboard/useLighting";
import type { Light } from "@/types";
import { Lightbulb, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface LightControlProps {
  light: Light;
  homeId: string;
}

export function LightControl({ light, homeId }: LightControlProps) {
  const [brightness, setBrightness] = useState(light.brightness);
  const [temperature, setTemperature] = useState(light.temperature);
  const [localIsOn, setLocalIsOn] = useState(light.isOn);
  const { toggleLight, adjustBrightness, adjustTemperature } = useLighting(
    homeId,
    [light]
  );

  useEffect(() => {
    setLocalIsOn(light.isOn);
  }, [light.isOn]);

  useEffect(() => {
    setBrightness(light.brightness);
  }, [light.brightness]);

  useEffect(() => {
    setTemperature(light.temperature);
  }, [light.temperature]);

  const handleToggle = () => {
    const optimisticIsOn = !localIsOn;
    setLocalIsOn(optimisticIsOn);
    toggleLight(light.id);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
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
        />
      </div>
      {localIsOn && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Brightness</span>
              <span className="text-sm font-medium">{brightness}%</span>
            </div>
            <Slider
              defaultValue={[brightness]}
              value={[brightness]}
              min={0}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-yellow-400"
              onValueChange={(values) => {
                const newValue = values[0];
                setBrightness(newValue);
                adjustBrightness(light.id, newValue);
              }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Temperature</span>
              <span className="text-sm font-medium">{temperature}K</span>
            </div>
            <div className="flex items-center gap-4">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Slider
                defaultValue={[temperature]}
                value={[temperature]}
                min={2700}
                max={6500}
                step={100}
                className="flex-1 [&_[role=slider]]:bg-yellow-400"
                onValueChange={(values) => {
                  const newValue = values[0];
                  setTemperature(newValue);
                  adjustTemperature(light.id, newValue);
                }}
              />
              <Sun className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

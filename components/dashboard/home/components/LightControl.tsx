"use client";

import { type Light } from "@/app/actions/lighting";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Moon, Sun } from "lucide-react";

interface LightControlProps {
  light: Light;
  onToggle: () => void;
  onBrightnessChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  isConnected: boolean;
}

export function LightControl({
  light,
  onToggle,
  onBrightnessChange,
  onTemperatureChange,
  isConnected,
}: LightControlProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb
            className={`h-4 w-4 ${
              light.isOn ? "text-yellow-400" : "text-muted-foreground"
            }`}
          />
          <span className="font-medium">{light.name}</span>
        </div>
        <Switch
          checked={light.isOn}
          onCheckedChange={onToggle}
          disabled={!isConnected}
          className="data-[state=checked]:bg-yellow-400"
        />
      </div>
      {light.isOn && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Brightness</span>
              <span className="text-sm font-medium">{light.brightness}%</span>
            </div>
            <Slider
              value={[light.brightness]}
              min={0}
              max={100}
              step={1}
              disabled={!isConnected}
              className="[&_[role=slider]]:bg-yellow-400"
              onValueChange={([value]) => onBrightnessChange(value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Temperature</span>
              <span className="text-sm font-medium">{light.temperature}K</span>
            </div>
            <div className="flex items-center gap-4">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[light.temperature]}
                min={2700}
                max={6500}
                step={100}
                disabled={!isConnected}
                className="flex-1 [&_[role=slider]]:bg-yellow-400"
                onValueChange={([value]) => onTemperatureChange(value)}
              />
              <Sun className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

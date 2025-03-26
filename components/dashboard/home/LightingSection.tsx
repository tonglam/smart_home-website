"use client";

import { getLightingData, type Light } from "@/app/actions/lighting";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { HiLightBulb, HiMoon, HiSun } from "react-icons/hi";

const LightControl = ({
  light,
  onToggle,
  onBrightnessChange,
  onTemperatureChange,
}: {
  light: Light;
  onToggle: () => void;
  onBrightnessChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
}) => {
  const TempIcon = light.temperature <= 4000 ? HiMoon : HiSun;

  return (
    <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm">{light.name}</span>
        <Switch checked={light.isOn} onCheckedChange={onToggle} />
      </div>
      {light.isOn && (
        <>
          <div className="flex items-center gap-2">
            <HiLightBulb className="h-4 w-4" />
            <Slider
              value={[light.brightness]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => onBrightnessChange(value)}
            />
            <span className="text-sm w-12 text-right">{light.brightness}%</span>
          </div>
          <div className="flex items-center gap-2">
            <TempIcon className="h-4 w-4" />
            <Slider
              value={[light.temperature]}
              min={2700}
              max={6500}
              step={100}
              onValueChange={([value]) => onTemperatureChange(value)}
            />
            <span className="text-sm w-16 text-right">
              {`${light.temperature}K`}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export function LightingSection() {
  const [lights, setLights] = useState<Light[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLightingData = async () => {
      try {
        setIsLoading(true);
        const data = await getLightingData();
        setLights(data);
      } catch (error) {
        console.error("Error fetching lighting data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLightingData();
  }, []);

  const toggleLight = (id: string) => {
    setLights(
      lights.map((light) =>
        light.id === id ? { ...light, isOn: !light.isOn } : light
      )
    );
  };

  const adjustBrightness = (id: string, value: number) => {
    setLights(
      lights.map((light) =>
        light.id === id ? { ...light, brightness: value } : light
      )
    );
  };

  const adjustTemperature = (id: string, value: number) => {
    setLights(
      lights.map((light) =>
        light.id === id ? { ...light, temperature: value } : light
      )
    );
  };

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6 order-1">
        <div className="flex items-center gap-2 mb-4">
          <HiLightBulb className="h-5 w-5" />
          <h3 className="font-semibold">Lighting</h3>
        </div>
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 order-1">
      <div className="flex items-center gap-2 mb-4">
        <HiLightBulb className="h-5 w-5" />
        <h3 className="font-semibold">Lighting</h3>
      </div>
      <div className="space-y-4">
        {lights.map((light) => (
          <LightControl
            key={light.id}
            light={light}
            onToggle={() => toggleLight(light.id)}
            onBrightnessChange={(value) => adjustBrightness(light.id, value)}
            onTemperatureChange={(value) => adjustTemperature(light.id, value)}
          />
        ))}
      </div>
    </Card>
  );
}

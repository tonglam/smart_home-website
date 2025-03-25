"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  defaultAutomationModes,
  defaultLights,
  securityPoints,
} from "@/lib/data";
import { useState } from "react";
import {
  HiBookOpen,
  HiDesktopComputer,
  HiHome,
  HiInformationCircle,
  HiKey,
  HiLightBulb,
  HiMoon,
  HiShieldCheck,
  HiSparkles,
  HiSun,
} from "react-icons/hi";

interface AutomationModeState {
  id: string;
  showInfo: boolean;
}

export function SmartHomeGrid() {
  // Lighting States
  const [lights, setLights] = useState(defaultLights);

  // Automation States
  const [automationModes, setAutomationModes] = useState(
    defaultAutomationModes.map((mode) => ({
      ...mode,
      icon: getIconComponent(mode.icon),
    }))
  );

  // Info states for automation modes
  const [automationInfoStates, setAutomationInfoStates] = useState<
    AutomationModeState[]
  >(defaultAutomationModes.map((mode) => ({ id: mode.id, showInfo: false })));

  function getIconComponent(iconName: string) {
    switch (iconName) {
      case "Home":
        return HiHome;
      case "Film":
        return HiDesktopComputer;
      case "BookOpen":
        return HiBookOpen;
      default:
        return HiHome;
    }
  }

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

  const getTemperatureIcon = (temp: number) => {
    return temp <= 4000 ? HiMoon : HiSun;
  };

  const formatTemperature = (temp: number) => {
    return `${temp}K`;
  };

  const toggleMode = (modeId: string) => {
    setAutomationModes((modes) =>
      modes.map((mode) => ({
        ...mode,
        active: mode.id === modeId ? !mode.active : false,
      }))
    );
  };

  const toggleInfo = (modeId: string) => {
    setAutomationInfoStates((states) =>
      states.map((state) =>
        state.id === modeId ? { ...state, showInfo: !state.showInfo } : state
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Lighting Control */}
      <Card className="p-4 sm:p-6 order-1">
        <div className="flex items-center gap-2 mb-4">
          <HiLightBulb className="h-5 w-5" />
          <h3 className="font-semibold">Lighting</h3>
        </div>
        <div className="space-y-4">
          {lights.map((light) => {
            const TempIcon = getTemperatureIcon(light.temperature);
            return (
              <div
                key={light.id}
                className="space-y-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{light.name}</span>
                  <Switch
                    checked={light.isOn}
                    onCheckedChange={() => toggleLight(light.id)}
                  />
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
                        onValueChange={([value]) =>
                          adjustBrightness(light.id, value)
                        }
                      />
                      <span className="text-sm w-12 text-right">
                        {light.brightness}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TempIcon className="h-4 w-4" />
                      <Slider
                        value={[light.temperature]}
                        min={2700}
                        max={6500}
                        step={100}
                        onValueChange={([value]) =>
                          adjustTemperature(light.id, value)
                        }
                      />
                      <span className="text-sm w-16 text-right">
                        {formatTemperature(light.temperature)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Automation */}
      <Card className="p-4 sm:p-6 order-2">
        <div className="flex items-center gap-2 mb-4">
          <HiSparkles className="h-5 w-5" />
          <h3 className="font-semibold">Automation</h3>
        </div>
        <div className="space-y-3">
          {automationModes.map((mode) => {
            const Icon = mode.icon;
            const infoState = automationInfoStates.find(
              (state) => state.id === mode.id
            );
            return (
              <div
                key={mode.id}
                className="p-3 bg-muted/50 rounded-lg relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{mode.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleInfo(mode.id)}
                  >
                    <HiInformationCircle className="h-4 w-4" />
                  </Button>
                </div>
                {infoState?.showInfo && (
                  <p className="text-sm text-muted-foreground mb-3 bg-popover rounded-md p-2 shadow-sm">
                    {mode.description}
                  </p>
                )}
                <Button
                  variant={mode.active ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => toggleMode(mode.id)}
                >
                  {mode.active ? "Active" : "Activate"}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-4 sm:p-6 order-3">
        <div className="flex items-center gap-2 mb-4">
          <HiShieldCheck className="h-5 w-5" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <div className="space-y-3">
          {securityPoints.map((point) => (
            <div
              key={point.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                {point.type === "door" ? (
                  <HiKey className="h-4 w-4" />
                ) : (
                  <HiDesktopComputer className="h-4 w-4" />
                )}
                <span className="text-sm">{point.name}</span>
              </div>
              <Badge
                variant={point.status === "closed" ? "default" : "destructive"}
              >
                {point.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, Shield, Wand2, 
  DoorOpen as Door, AppWindow as Window,
  Info, Sun, Sunset, Home, Film, BookOpen
} from 'lucide-react';
import { defaultLights, defaultAutomationModes, securityPoints } from '@/lib/data';

interface SmartHomeGridProps {
  isConnected: boolean;
}

export function SmartHomeGrid({ isConnected }: SmartHomeGridProps) {
  // Security States
  const [systemArmed, setSystemArmed] = useState(true);

  // Lighting States
  const [lights, setLights] = useState(defaultLights);

  // Automation States
  const [automationModes, setAutomationModes] = useState(defaultAutomationModes.map(mode => ({
    ...mode,
    icon: getIconComponent(mode.icon)
  })));

  function getIconComponent(iconName: string) {
    switch (iconName) {
      case 'Home': return Home;
      case 'Film': return Film;
      case 'BookOpen': return BookOpen;
      default: return Home;
    }
  }

  const toggleLight = (id: string) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, isOn: !light.isOn } : light
    ));
  };

  const adjustBrightness = (id: string, value: number) => {
    setLights(lights.map(light =>
      light.id === id ? { ...light, brightness: value } : light
    ));
  };

  const adjustTemperature = (id: string, value: number) => {
    setLights(lights.map(light =>
      light.id === id ? { ...light, temperature: value } : light
    ));
  };

  const getTemperatureIcon = (temp: number) => {
    return temp <= 4000 ? Sunset : Sun;
  };

  const formatTemperature = (temp: number) => {
    return `${temp}K`;
  };

  const toggleMode = (modeId: string) => {
    setAutomationModes(modes => modes.map(mode => ({
      ...mode,
      active: mode.id === modeId ? !mode.active : false
    })));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Lighting Control */}
      <Card className="p-4 sm:p-6 order-1">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5" />
          <h3 className="font-semibold">Lighting</h3>
        </div>
        <div className="space-y-4">
          {lights.map(light => {
            const TempIcon = getTemperatureIcon(light.temperature);
            return (
            <div key={light.id} className="space-y-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">{light.name}</span>
                <Switch
                  checked={light.isOn}
                  onCheckedChange={() => toggleLight(light.id)}
                  disabled={!isConnected}
                />
              </div>
              {light.isOn && (
                <>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <Slider
                      value={[light.brightness]}
                      min={0}
                      max={100}
                      step={1}
                      disabled={!isConnected}
                      onValueChange={([value]) => adjustBrightness(light.id, value)}
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
                      disabled={!isConnected}
                      onValueChange={([value]) => adjustTemperature(light.id, value)}
                    />
                    <span className="text-sm w-16 text-right">{formatTemperature(light.temperature)}</span>
                  </div>
                </>
              )}
            </div>
          )})}
        </div>
      </Card>

      {/* Automation */}
      <Card className="p-4 sm:p-6 order-2">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="h-5 w-5" />
          <h3 className="font-semibold">Automation</h3>
        </div>
        <div className="space-y-3">
          {automationModes.map(mode => {
            const Icon = mode.icon;
            const [showInfo, setShowInfo] = useState(false);
            return (
              <div key={mode.id} className="p-3 bg-muted/50 rounded-lg relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{mode.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
                {showInfo && (
                  <p className="text-sm text-muted-foreground mb-3 bg-popover rounded-md p-2 shadow-sm">
                  {mode.description}
                  </p>
                )}
                <Button
                  variant={mode.active ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={!isConnected}
                  onClick={() => toggleMode(mode.id)}
                >
                  {mode.active ? 'Active' : 'Activate'}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-4 sm:p-6 order-3">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <div className="space-y-3">
          {securityPoints.map(point => (
            <div key={point.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                {point.type === 'door' ? <Door className="h-4 w-4" /> : <Window className="h-4 w-4" />}
                <span className="text-sm">{point.name}</span>
              </div>
              <Badge variant={point.status === 'closed' ? 'default' : 'destructive'}>
                {point.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
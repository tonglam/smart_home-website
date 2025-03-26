"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAutomation } from "@/hooks";
import { securityPoints } from "@/lib/data";
import { useUser } from "@clerk/nextjs";
import { Shield, Wand2 } from "lucide-react";
import { LightingSection } from "./LightingSection";
import { AutomationMode } from "./components/AutomationMode";
import { SecurityPoint } from "./components/SecurityPoint";

export function SmartHomeGrid() {
  const { isSignedIn } = useUser();
  const { modes, toggleMode, toggleInfo } = useAutomation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Lighting Section */}
      <div className="order-1">
        <LightingSection isConnected={!!isSignedIn} />
      </div>

      {/* Automation Section */}
      <Card className="p-4 sm:p-6 order-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Wand2 className="h-5 w-5" />
            Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {modes.map((mode) => (
            <AutomationMode
              key={mode.id}
              {...mode}
              isConnected={!!isSignedIn}
              onToggleMode={() => toggleMode(mode.id)}
              onToggleInfo={() => toggleInfo(mode.id)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="p-4 sm:p-6 order-3">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {securityPoints.map((point) => (
            <SecurityPoint key={point.id} {...point} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

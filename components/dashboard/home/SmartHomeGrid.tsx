"use client";

import type { SecurityPoint as SecurityPointType } from "@/app/actions/security";
import { getSecurityPoints } from "@/app/actions/security";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAutomation } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import { BookOpenIcon, FilmIcon, HomeIcon, Shield, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LightingSection } from "./LightingSection";
import { AutomationMode } from "./components/AutomationMode";
import { SecurityPoint } from "./components/SecurityPoint";

const iconComponents = {
  Home: HomeIcon,
  Film: FilmIcon,
  BookOpen: BookOpenIcon,
};

export function SmartHomeGrid() {
  const { isSignedIn, user } = useUser();
  const { modes, isLoading, handleModeToggle } = useAutomation();
  const [securityPoints, setSecurityPoints] = useState<SecurityPointType[]>([]);
  const homeId = user?.publicMetadata?.homeId as string;

  useEffect(() => {
    async function fetchSecurityPoints() {
      try {
        const points = await getSecurityPoints(homeId);
        setSecurityPoints(points);
      } catch (error) {
        console.error("[SmartHomeGrid] Error fetching security points:", error);
      }
    }

    if (homeId) {
      fetchSecurityPoints();
    }
  }, [isSignedIn, homeId]);

  if (!isSignedIn || !homeId) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-sm text-muted-foreground text-center py-2 col-span-full">
          {!isSignedIn
            ? "Please sign in to view your smart home dashboard"
            : "Please connect your home to view the dashboard"}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Lighting Section */}
      <div className="order-1">
        <LightingSection isConnected={!!isSignedIn} homeId={homeId} />
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
              icon={iconComponents[mode.icon as keyof typeof iconComponents]}
              isConnected={!!isSignedIn}
              isLoading={isLoading}
              onToggleMode={() => handleModeToggle(mode)}
              onToggleInfo={() => {}}
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

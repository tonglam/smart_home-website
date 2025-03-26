"use client";

import type { SecurityPoint as SecurityPointType } from "@/app/actions/security";
import { getSecurityPoints } from "@/app/actions/security";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  const {
    modes,
    isLoading: automationLoading,
    handleModeToggle,
  } = useAutomation();
  const [securityPoints, setSecurityPoints] = useState<SecurityPointType[]>([]);
  const [securityLoading, setSecurityLoading] = useState(true);
  const homeId = user?.publicMetadata?.homeId as string;

  useEffect(() => {
    async function fetchSecurityPoints() {
      if (!homeId) return;
      try {
        setSecurityLoading(true);
        const points = await getSecurityPoints(homeId);
        setSecurityPoints(points);
      } catch (error) {
        console.error("[SmartHomeGrid] Error fetching security points:", error);
      } finally {
        setSecurityLoading(false);
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

  // Security section with loading state
  const renderSecuritySection = () => (
    <Card className="p-4 sm:p-6 order-3">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {securityLoading ? (
          // Skeleton loading state
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </>
        ) : (
          // Actual content
          securityPoints.map((point) => (
            <SecurityPoint key={point.id} {...point} />
          ))
        )}
      </CardContent>
    </Card>
  );

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
          {automationLoading ? (
            // Skeleton loading state for automation modes
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </>
          ) : (
            modes.map((mode) => (
              <AutomationMode
                key={mode.id}
                {...mode}
                icon={iconComponents[mode.icon as keyof typeof iconComponents]}
                isConnected={!!isSignedIn}
                isLoading={automationLoading}
                onToggleMode={() => handleModeToggle(mode)}
                onToggleInfo={() => {}}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Security Section */}
      {renderSecuritySection()}
    </div>
  );
}

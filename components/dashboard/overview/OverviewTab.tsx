"use client";

import { AutomationSection } from "@/components/dashboard/overview/automation/AutomationSection";
import { LightingSection } from "@/components/dashboard/overview/lighting/LightingSection";
import { SecuritySection } from "@/components/dashboard/overview/security/SecuritySection";
import { subscribeToTableChanges, supabase } from "@/lib/utils/supabase.util";
import type {
  AutomationMode,
  Light,
  SecurityPoint,
} from "@/types/dashboard.types";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const getDeviceSecurityType = (
  devicePayload: any
): "door" | "window" | "motion" | null => {
  if (!devicePayload || typeof devicePayload.type !== "string") return null;
  const type = devicePayload.type.toLowerCase();
  if (type.startsWith("door")) return "door";
  if (type.startsWith("window")) return "window";
  if (type.startsWith("motion")) return "motion";
  return null;
};

const transformPayloadToSecurityPoint = (
  devicePayload: any
): SecurityPoint | null => {
  const securityType = getDeviceSecurityType(devicePayload);
  if (securityType !== "door" && securityType !== "window") {
    return null;
  }
  let status: "open" | "closed" = "closed";
  if (devicePayload.current_state) {
    const state = String(devicePayload.current_state).toLowerCase();
    if (
      state === "open" ||
      state === "unlocked" ||
      state === "active" ||
      state === "on" ||
      state === "triggered"
    ) {
      status = "open";
    }
  }
  return {
    id: devicePayload.id,
    name: devicePayload.name || "Unknown Device",
    type: securityType,
    status: status,
    lastUpdated: devicePayload.last_updated
      ? new Date(devicePayload.last_updated).toISOString()
      : new Date().toISOString(),
    icon: securityType,
  };
};

interface OverviewTabProps {
  lightDevices: Light[];
  automationModes: AutomationMode[];
  currentMode: string;
  securityPoints: SecurityPoint[];
  homeId: string;
}

export function OverviewTab({
  lightDevices,
  automationModes,
  currentMode,
  securityPoints: initialSecurityPoints,
  homeId,
}: OverviewTabProps) {
  const [liveSecurityPoints, setLiveSecurityPoints] = useState<SecurityPoint[]>(
    initialSecurityPoints
  );

  useEffect(() => {
    setLiveSecurityPoints(initialSecurityPoints);
  }, [initialSecurityPoints]);

  useEffect(() => {
    const channel: RealtimeChannel = subscribeToTableChanges<any>(
      `devices-changes-${homeId}-overviewtab`,
      ["INSERT", "UPDATE", "DELETE"],
      "public",
      "devices",
      (payload: RealtimePostgresChangesPayload<any>) => {
        if (payload.eventType === "INSERT") {
          const newDevicePayload = payload.new;
          const newSecurityPoint =
            transformPayloadToSecurityPoint(newDevicePayload);
          if (newSecurityPoint && newDevicePayload.home_id === homeId) {
            setLiveSecurityPoints((currentPoints) => {
              if (!currentPoints.find((p) => p.id === newSecurityPoint.id)) {
                return [...currentPoints, newSecurityPoint];
              }
              return currentPoints;
            });
          }
        } else if (payload.eventType === "UPDATE") {
          const updatedDevicePayload = payload.new;
          if (updatedDevicePayload.home_id !== homeId) return;

          const transformedUpdatedPoint =
            transformPayloadToSecurityPoint(updatedDevicePayload);
          setLiveSecurityPoints(
            (currentPoints) =>
              currentPoints
                .map((point) => {
                  if (point.id === updatedDevicePayload.id) {
                    if (transformedUpdatedPoint) {
                      if (
                        point.status !== transformedUpdatedPoint.status ||
                        point.lastUpdated !==
                          transformedUpdatedPoint.lastUpdated ||
                        point.name !== transformedUpdatedPoint.name
                      ) {
                        return transformedUpdatedPoint;
                      }
                      return point;
                    } else {
                      return null;
                    }
                  }
                  return point;
                })
                .filter(Boolean) as SecurityPoint[]
          );
        } else if (payload.eventType === "DELETE") {
          const deletedDevicePayload = payload.old;
          if (
            deletedDevicePayload &&
            deletedDevicePayload.id &&
            (deletedDevicePayload.home_id === undefined ||
              deletedDevicePayload.home_id === homeId)
          ) {
            setLiveSecurityPoints((currentPoints) =>
              currentPoints.filter(
                (point) => point.id !== deletedDevicePayload.id
              )
            );
          }
        }
      }
    );

    return () => {
      if (channel) {
        supabase
          .removeChannel(channel)
          .catch((error) =>
            console.error(
              `[OverviewTab] Error removing channel ${channel.topic}:`,
              error
            )
          );
      }
    };
  }, [homeId]);

  return (
    <div className="space-y-6">
      {/* Display live count */}
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <p className="text-lg font-semibold">
          Live Security Devices Count: {liveSecurityPoints.length}
        </p>
      </div>

      {/* Lighting and Automation - These are related as automation applies to lights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lighting Section - Takes 2/3 of space on larger screens */}
        <div className="lg:col-span-2">
          <LightingSection lightDevices={lightDevices} homeId={homeId} />
        </div>

        {/* Automation Section - Takes 1/3 of space on larger screens */}
        <div>
          <AutomationSection
            lightDevices={lightDevices}
            modes={automationModes}
            currentMode={currentMode}
            homeId={homeId}
          />
        </div>
      </div>

      {/* Security Section - Full width */}
      <div>
        {/* Pass the live-updated list to SecuritySection */}
        <SecuritySection securityPoints={liveSecurityPoints} />
      </div>
    </div>
  );
}

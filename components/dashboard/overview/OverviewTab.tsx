"use client";

import { AutomationSection } from "@/components/dashboard/overview/automation/AutomationSection";
import { ControlSection } from "@/components/dashboard/overview/control/ControlSection";
import { SecuritySection } from "@/components/dashboard/overview/security/SecuritySection";
import { subscribeToTableChanges, supabase } from "@/lib/utils/supabase.util";
import type {
  AutomationMode,
  Camera,
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
):
  | "door"
  | "window"
  | "motion"
  | "led_light"
  | "camera"
  | "lux_sensor"
  | "reed_switch"
  | null => {
  if (!devicePayload || typeof devicePayload.type !== "string") return null;
  const type = devicePayload.type.toLowerCase();
  if (type.startsWith("door")) return "door";
  if (type.startsWith("window")) return "window";
  if (type.startsWith("motion")) return "motion";
  if (type === "led_light") return "led_light";
  if (type === "camera") return "camera";
  if (type === "lux_sensor") return "lux_sensor";
  if (type === "reed_switch") return "reed_switch";
  return null;
};

const transformPayloadToSecurityPoint = (
  devicePayload: any
): SecurityPoint | null => {
  const securityType = getDeviceSecurityType(devicePayload);

  // Allow all valid security types that getDeviceSecurityType can return
  if (!securityType) {
    return null;
  }

  let status = "unknown"; // Default status
  if (devicePayload.current_state) {
    const state = String(devicePayload.current_state).toLowerCase();
    if (securityType === "door" || securityType === "window") {
      status =
        state === "open" ||
        state === "unlocked" ||
        state === "active" ||
        state === "on" ||
        state === "triggered"
          ? "open"
          : "closed";
    } else if (securityType === "motion") {
      status =
        state === "motion_detected" ||
        state === "active" ||
        state === "on" ||
        state === "triggered"
          ? "motion_detected"
          : "no_motion";
    } else if (securityType === "led_light") {
      status = state === "on" || state === "active" ? "on" : "off";
    } else if (securityType === "camera") {
      status =
        state === "recording" || state === "online" || state === "active"
          ? "recording"
          : "idle";
    } else {
      status = state; // Use the state directly for other types or refine as needed
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
    icon: securityType === "motion" ? "device" : securityType,
  };
};

interface OverviewTabProps {
  lightDevices: Light[];
  cameraDevices: Camera[];
  automationModes: AutomationMode[];
  currentMode: string;
  securityPoints: SecurityPoint[];
  homeId: string;
}

export function OverviewTab({
  lightDevices,
  cameraDevices,
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
      {/* Lighting and Automation - These are related as automation applies to lights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lighting Section - Takes 2/3 of space on larger screens */}
        <div className="lg:col-span-2">
          <ControlSection
            lightDevices={lightDevices}
            cameraDevices={cameraDevices}
            homeId={homeId}
          />
        </div>

        {/* Automation Section - Takes 1/3 of space on larger screens */}
        <div>
          <AutomationSection
            modes={automationModes}
            currentMode={currentMode || "home"}
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

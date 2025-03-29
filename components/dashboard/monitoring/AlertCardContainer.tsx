"use client"; // Make this a Client Component

import { dismissAlert as dismissAlertAction } from "@/app/actions/dashboard/alerts.action";
import { Card } from "@/components/ui/card";
import type { Alert } from "@/types/dashboard.types";
import { Activity } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCard } from "./AlertCard";

interface AlertCardContainerProps {
  alerts: Alert[];
}

export function AlertCardContainer({
  alerts: initialAlerts,
}: AlertCardContainerProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);

  const handleDismiss = useCallback(
    async (alertId: string, deviceName: string) => {
      const alertToDismiss = alerts.find((a) => a.id === alertId);
      if (!alertToDismiss) return;

      const originalAlerts = [...alerts];
      // Optimistic update
      setAlerts((currentAlerts) => {
        const newState = currentAlerts.filter((alert) => alert.id !== alertId);
        return newState;
      });

      try {
        const success = await dismissAlertAction(alertId);

        if (success) {
          toast.success(`The alert for ${deviceName} has been dismissed.`, {
            description: "Alert Dismissed",
            duration: 3000,
          });
        } else {
          throw new Error("Server action returned false.");
        }
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] handleDismiss: Error dismissing alert ID ${alertId}:`,
          error
        );

        setAlerts(originalAlerts);

        toast.error(
          `Could not dismiss the alert for ${deviceName}. Please try again.`,
          {
            description: "Dismissal Failed",
            duration: 5000,
          }
        );
      }
    },
    [alerts]
  );

  return (
    <Card className="border-l-4 border-l-orange-500">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-lg flex-1">
            {/* Use local state for count */}
            Critical Alerts {alerts.length > 0 && `(${alerts.length})`}
          </h3>
        </div>
        {/* Pass local state and the local handler down to AlertCard */}
        <AlertCard alerts={alerts} onDismiss={handleDismiss} />
      </div>
    </Card>
  );
}

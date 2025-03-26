"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAlerts } from "@/hooks/dashboard/useAlerts";
import { AlertCircle } from "lucide-react";
import { AlertsCard } from "./AlertsCard";
import { CameraFeed } from "./CameraFeed";

export function MonitoringContent() {
  const {
    alerts,
    isLoading: alertsLoading,
    error: alertsError,
    dismissAlert,
  } = useAlerts();

  // Show system error if monitoring systems are down
  if (alertsError) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          System Error: Unable to fetch monitoring data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <AlertsCard
        alerts={alerts}
        isLoading={alertsLoading}
        onDismiss={dismissAlert}
        error={alertsError}
      />

      {/* Camera Section */}
      <CameraFeed />
    </div>
  );
}

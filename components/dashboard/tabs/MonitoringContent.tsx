"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAlerts } from "@/hooks/dashboard/useAlerts";
import { Activity, AlertCircle, Video } from "lucide-react";
import Image from "next/image";
import { AlertsCard } from "./AlertsCard";

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
      <div>
        <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
              </div>
              <span className="text-sm text-green-500">Live</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video relative">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="Front Door Camera Feed"
                fill
                className="object-cover"
                priority
              />
            </div>
            <Button
              size="icon"
              className="absolute bottom-4 right-4 h-12 w-12 rounded-full"
              onClick={() => window.open("tel:+1234567890")}
            >
              <Activity className="h-6 w-6" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

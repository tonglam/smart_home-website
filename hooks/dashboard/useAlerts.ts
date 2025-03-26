"use client";

import { Alert } from "@/components/dashboard/tabs/types";
import { useCallback, useEffect, useState } from "react";

const INITIAL_ALERTS: Alert[] = [
  {
    id: "1",
    type: "warning",
    message: "Front door camera battery is low",
    timestamp: new Date().toLocaleString(),
    deviceId: "front-door-cam",
    deviceName: "Front Door Camera",
  },
];

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulated API call to /api/alerts
      // In a real app, this would be an actual API call
      const response = await new Promise<Alert[]>((resolve) => {
        setTimeout(() => {
          resolve(INITIAL_ALERTS);
        }, 1000);
      });

      setAlerts(response);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch alerts")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      // Simulated API call to /api/alerts/{alertId}
      // In a real app, this would be an actual API call
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
      // Optionally set an error state or show a toast notification
    }
  }, []);

  const addAlert = useCallback(
    async (alert: Omit<Alert, "id" | "timestamp">) => {
      try {
        // Simulated API call to /api/alerts
        // In a real app, this would be an actual API call
        const newAlert: Alert = {
          ...alert,
          id: Math.random().toString(36).slice(2),
          timestamp: new Date().toLocaleString(),
        };

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 500);
        });

        setAlerts((current) => [...current, newAlert]);
      } catch (err) {
        console.error("Failed to add alert:", err);
        // Optionally set an error state or show a toast notification
      }
    },
    []
  );

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return {
    alerts,
    isLoading,
    error,
    dismissAlert,
    addAlert,
    refetch: fetchAlerts,
  };
}

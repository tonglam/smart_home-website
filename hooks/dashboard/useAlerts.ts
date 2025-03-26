"use client";

import { dismissAlert, getCriticalAlerts } from "@/app/actions/critical-alerts";
import { Alert } from "@/components/dashboard/tabs/types";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

export function useAlerts() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState(0);

  const fetchAlerts = useCallback(
    async (force = false) => {
      // Skip if we fetched recently (within 10 seconds) and not forced
      const now = Date.now();
      if (!force && now - lastFetched < 10000) {
        return;
      }

      try {
        setIsLoading(true);
        const homeId = user?.publicMetadata?.homeId as string;
        if (!homeId) {
          setAlerts([]);
          return;
        }
        const response = await getCriticalAlerts(homeId);
        setAlerts(response);
        setError(null);
        setLastFetched(now);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch alerts")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user?.publicMetadata?.homeId, lastFetched]
  );

  const handleDismiss = useCallback(async (alertId: string) => {
    try {
      const success = await dismissAlert(alertId);
      if (success) {
        setAlerts((current) => current.filter((alert) => alert.id !== alertId));
      }
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
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
    fetchAlerts(true); // Force initial fetch

    // Reduce polling frequency to every minute instead of every 30 seconds
    const interval = setInterval(() => fetchAlerts(), 60000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return {
    alerts,
    isLoading,
    error,
    dismissAlert: handleDismiss,
    addAlert,
    refetch: () => fetchAlerts(true), // Force refresh when explicitly called
  };
}

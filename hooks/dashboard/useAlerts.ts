"use client";

import { dismissAlert } from "@/app/actions/dashboard/alerts.action";
import { useCallback } from "react";

export function useAlerts() {
  const handleDismiss = useCallback(async (alertId: string) => {
    try {
      await dismissAlert(alertId);
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    }
  }, []);

  return {
    dismissAlert: handleDismiss,
  };
}

/**
 * Hook for managing smart home alerts and notifications
 * Provides functionality to dismiss and handle alert states
 */
"use client";

import { dismissAlert } from "@/app/actions/dashboard/alerts.action";
import { useCallback } from "react";

export function useAlerts() {
  /**
   * Dismisses an alert by ID
   * Handles error logging if dismissal fails
   */
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

"use client";

import { SessionState } from "@/types/hook.types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const CHECK_INTERVAL = 60 * 1000; // every minute

export function useSession(): SessionState {
  const { isSignedIn, refreshSession } = useAuth();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const isActive = useMemo(() => {
    if (!isSignedIn || !timeLeft) return false;
    return timeLeft > 0;
  }, [isSignedIn, timeLeft]);

  const updateLastActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  const handleRefreshSession = useCallback(async () => {
    try {
      await refreshSession();
      setShowWarning(false);
      updateLastActivity();
      toast.success("Session refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh session", {
        description: "Please try signing in again.",
      });
      router.push("/signin" as any);
    }
  }, [refreshSession, router, updateLastActivity]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  const checkSessionExpiry = useCallback(() => {
    if (!isSignedIn) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    const timeUntilExpiry = SESSION_WARNING_TIME - timeSinceLastActivity;

    setTimeLeft(timeUntilExpiry);

    if (timeUntilExpiry <= SESSION_WARNING_TIME && !showWarning) {
      setShowWarning(true);
      toast.warning("Your session will expire soon", {
        description: "Please save your work and refresh your session.",
        duration: 0,
        action: {
          label: "Refresh Now",
          onClick: handleRefreshSession,
        },
      });
    }

    if (timeUntilExpiry <= 0) {
      toast.error("Your session has expired", {
        description: "Please sign in again to continue.",
      });
      router.push("/signin" as any);
    }
  }, [isSignedIn, lastActivity, showWarning, handleRefreshSession, router]);

  useEffect(() => {
    if (!isSignedIn) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, [isSignedIn, updateLastActivity]);

  useEffect(() => {
    if (!isSignedIn) return;

    checkSessionExpiry();

    const interval = setInterval(checkSessionExpiry, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isSignedIn, checkSessionExpiry]);

  return {
    timeLeft,
    showWarning,
    isActive,
    refreshSession: handleRefreshSession,
    dismissWarning,
  } as const;
}

/**
 * Hook for managing smart home connections and user-home associations
 * Handles connecting/disconnecting homes and maintaining connection state
 */
import { updateUserHomeId } from "@/app/actions/user/user.action";
import { type UseHomeConnectionReturn } from "@/types/hook.types";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

interface UseHomeConnectionProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  initialHomeId?: string | null;
}

export function useHomeConnection({
  onOpenChange,
  open,
  initialHomeId,
}: UseHomeConnectionProps): UseHomeConnectionReturn {
  const { user, isLoaded } = useUser();
  const [currentHomeId, setCurrentHomeId] = useState<string>(
    initialHomeId || ""
  );
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * Revalidates the home connection by checking the user's metadata
   * Updates local state if the connection has changed
   */
  const revalidateConnection = useCallback(async () => {
    if (!user) return;

    try {
      const updatedUser = await user.reload();
      const homeId = updatedUser.publicMetadata.homeId as string;
      if (homeId !== currentHomeId) {
        setCurrentHomeId(homeId || "");
      }
    } catch (error) {
      console.error("Error revalidating connection:", error);
    }
  }, [user, currentHomeId]);

  // Revalidate connection on window focus
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onFocus = () => {
      revalidateConnection();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [revalidateConnection]);

  // Revalidate connection when online
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onOnline = () => {
      revalidateConnection();
    };

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [revalidateConnection]);

  // Initialize home ID from user metadata
  useEffect(() => {
    if (isLoaded && user) {
      const homeId = user.publicMetadata.homeId as string;
      if (homeId && !currentHomeId) {
        setCurrentHomeId(homeId);
      }
    }
  }, [isLoaded, user, currentHomeId]);

  // Reset connecting state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsConnecting(false);
    }
  }, [open]);

  /**
   * Connects a user to a home by updating their metadata
   * Reloads the page to ensure fresh data after connection
   */
  const handleConnect = async (homeId: string) => {
    if (!user) {
      return;
    }

    setIsConnecting(true);

    try {
      const result = await updateUserHomeId(user.id, homeId);

      if (result.success) {
        setCurrentHomeId(homeId);
        onOpenChange(false);
        // Force reload to ensure fresh data
        window.location.reload();
      } else {
        console.error(
          "[handleConnect] Server action returned non-success:",
          result
        );
        throw new Error(result.error || "Failed to connect home");
      }
    } catch (error) {
      console.error("[handleConnect] Error connecting home:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnects a user from their current home
   * Reloads the page to ensure fresh data after disconnection
   */
  const handleDisconnect = async () => {
    if (!user) {
      return;
    }

    setIsConnecting(true);

    try {
      const result = await updateUserHomeId(user.id, "");

      if (result.success) {
        setCurrentHomeId("");
        onOpenChange(false);
        // Force reload to ensure fresh data
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to disconnect home");
      }
    } catch (error) {
      console.error("[handleDisconnect] Error disconnecting home:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    currentHomeId,
    isConnecting,
    isLoaded,
    handleConnect,
    handleDisconnect,
  };
}

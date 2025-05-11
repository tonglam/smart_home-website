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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onFocus = () => {
      revalidateConnection();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [revalidateConnection]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onOnline = () => {
      revalidateConnection();
    };

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [revalidateConnection]);

  useEffect(() => {
    if (isLoaded && user) {
      const homeId = user.publicMetadata.homeId as string;
      if (homeId && !currentHomeId) {
        setCurrentHomeId(homeId);
      }
    }
  }, [isLoaded, user, currentHomeId]);

  useEffect(() => {
    if (!open) {
      setIsConnecting(false);
    }
  }, [open]);

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

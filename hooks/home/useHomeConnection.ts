import { updateUserHomeId } from "@/app/actions/user";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseHomeConnectionProps {
  onConnect: (homeId: string) => void;
  onOpenChange: (open: boolean) => void;
  currentHomeId?: string;
  open: boolean;
}

export function useHomeConnection({
  onConnect,
  onOpenChange,
  currentHomeId,
  open,
}: UseHomeConnectionProps) {
  const { isSignedIn, user } = useUser();
  const [homeId, setHomeId] = useState<string>(currentHomeId || "");
  const [isConnecting, setIsConnecting] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setHomeId(currentHomeId || "");
    }
  }, [open, currentHomeId]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setHomeId("");
      setIsConnecting(false);
    }
  }, [open]);

  const handleConnect = async () => {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to connect your home", {
        description: "Authentication is required for this action",
      });
      return;
    }

    if (!homeId) {
      toast.error("Please enter a home ID", {
        description: "Home ID is required for this action",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const result = await updateUserHomeId(user.id, homeId);
      if (result.success) {
        toast.success("Home connected successfully", {
          description: "You can now manage your smart home devices",
        });
        onConnect(homeId);
        onOpenChange(false);
      } else {
        toast.error("Failed to connect home", {
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error connecting home:", error);
      toast.error("Failed to connect home", {
        description: "An unexpected error occurred. Please try again later",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to disconnect your home", {
        description: "Authentication is required for this action",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const result = await updateUserHomeId(user.id, "");
      if (result.success) {
        toast.success("Home disconnected successfully", {
          description: "Your home has been disconnected from your account",
        });
        onConnect("");
        onOpenChange(false);
      } else {
        toast.error("Failed to disconnect home", {
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error disconnecting home:", error);
      toast.error("Failed to disconnect home", {
        description: "An unexpected error occurred. Please try again later",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    homeId,
    setHomeId,
    isConnecting,
    handleConnect,
    handleDisconnect,
  };
}

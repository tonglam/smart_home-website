"use client";

import { updateUserHomeId } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Props for the ConnectionDialog component
interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (homeId: string) => void;
  currentHomeId?: string;
}

// DialogHeader component
const DialogHeaderContent = ({ currentHomeId }: { currentHomeId?: string }) => (
  <DialogHeader>
    <DialogTitle>
      {currentHomeId ? "Update Home Connection" : "Connect Your Smart Home"}
    </DialogTitle>
    <DialogDescription id="connect-home-description">
      {currentHomeId
        ? "Update your home ID to connect to a different smart home system."
        : "Enter your home ID to connect and manage your smart home devices."}
    </DialogDescription>
  </DialogHeader>
);

// HomeIdInput component
const HomeIdInput = ({
  homeId,
  setHomeId,
  isConnecting,
}: {
  homeId: string;
  setHomeId: (value: string) => void;
  isConnecting: boolean;
}) => (
  <div className="space-y-2">
    <Label htmlFor="homeId">Home ID</Label>
    <Input
      id="homeId"
      placeholder="Enter your home ID"
      value={homeId}
      onChange={(e) => setHomeId(e.target.value)}
      disabled={isConnecting}
    />
  </div>
);

// ConnectButton component
const ConnectButton = ({
  homeId,
  currentHomeId,
  isConnecting,
}: {
  homeId: string;
  currentHomeId?: string;
  isConnecting: boolean;
}) => (
  <Button
    type="submit"
    className="w-full"
    disabled={!homeId || isConnecting || homeId === currentHomeId}
  >
    {isConnecting
      ? "Connecting..."
      : currentHomeId
      ? "Update Connection"
      : "Connect Home"}
  </Button>
);

// DisconnectButton component
const DisconnectButton = ({
  isConnecting,
  onClick,
}: {
  isConnecting: boolean;
  onClick: () => void;
}) => (
  <Button
    type="button"
    variant="destructive"
    className="w-full mt-2"
    onClick={onClick}
    disabled={isConnecting}
  >
    {isConnecting ? "Disconnecting..." : "Disconnect Home"}
  </Button>
);

// Main ConnectionDialog component
export function ConnectionDialog({
  open,
  onOpenChange,
  onConnect,
  currentHomeId,
}: ConnectionDialogProps) {
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

  // Handle connect action
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

  // Handle disconnect action
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="connect-home-description">
        <DialogHeaderContent currentHomeId={currentHomeId} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConnect();
          }}
        >
          <div className="space-y-4">
            <HomeIdInput
              homeId={homeId}
              setHomeId={setHomeId}
              isConnecting={isConnecting}
            />
            <ConnectButton
              homeId={homeId}
              currentHomeId={currentHomeId}
              isConnecting={isConnecting}
            />
            {currentHomeId && (
              <DisconnectButton
                isConnecting={isConnecting}
                onClick={handleDisconnect}
              />
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

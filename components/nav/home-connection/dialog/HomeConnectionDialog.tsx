"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHomeConnection } from "@/hooks/home/useHomeConnection";
import { useEffect, useState } from "react";
import { DialogConnectButton } from "./DialogConnectButton";
import { DisconnectButton } from "./DialogDisconnectButton";
import { DialogHomeIdInput } from "./DialogHomeIdInput";

interface HomeConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHomeId?: string;
}

export function HomeConnectionDialog({
  open,
  onOpenChange,
  currentHomeId,
}: HomeConnectionDialogProps) {
  const [homeId, setHomeId] = useState(currentHomeId || "");
  const { isConnecting, handleConnect, handleDisconnect } = useHomeConnection({
    open,
    onOpenChange,
  });

  // Update homeId input when currentHomeId changes or dialog opens
  useEffect(() => {
    if (open) {
      setHomeId(currentHomeId || "");
    }
  }, [open, currentHomeId]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only connect if the ID is different
    if (homeId !== currentHomeId) {
      handleConnect(homeId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentHomeId
              ? "Manage Home Connection"
              : "Connect Your Smart Home"}
          </DialogTitle>
          <DialogDescription>
            {currentHomeId
              ? "Change your connected home ID or disconnect from this home."
              : "Connect your smart home to monitor and control your devices, view analytics, and set up automation."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <DialogHomeIdInput
            homeId={homeId}
            setHomeId={setHomeId}
            isConnecting={isConnecting}
            currentHomeId={currentHomeId}
          />
          <div className="flex flex-col gap-2">
            <DialogConnectButton
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

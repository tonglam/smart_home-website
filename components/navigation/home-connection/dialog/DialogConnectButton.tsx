"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogConnectButtonProps {
  homeId: string;
  currentHomeId?: string;
  isConnecting: boolean;
}

export function DialogConnectButton({
  homeId,
  currentHomeId,
  isConnecting,
}: DialogConnectButtonProps) {
  const isDisabled = !homeId || isConnecting || homeId === currentHomeId;
  const isChanging = Boolean(currentHomeId) && homeId !== currentHomeId;

  return (
    <Button type="submit" disabled={isDisabled} className="w-full">
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isChanging ? "Changing..." : "Connecting..."}
        </>
      ) : isChanging ? (
        "Change Home"
      ) : (
        "Connect"
      )}
    </Button>
  );
}

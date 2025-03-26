"use client";

import { Button } from "@/components/ui/button";

interface ConnectButtonProps {
  homeId: string;
  currentHomeId?: string;
  isConnecting: boolean;
}

export function ConnectButton({
  homeId,
  currentHomeId,
  isConnecting,
}: ConnectButtonProps) {
  return (
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
}

"use client";

import { Button } from "@/components/ui/button";

interface DisconnectButtonProps {
  isConnecting: boolean;
  onClick: () => void;
}

export function DisconnectButton({
  isConnecting,
  onClick,
}: DisconnectButtonProps) {
  return (
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
}

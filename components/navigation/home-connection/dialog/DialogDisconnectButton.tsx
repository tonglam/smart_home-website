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
      disabled={isConnecting}
      onClick={onClick}
    >
      {isConnecting ? "Disconnecting..." : "Disconnect Home"}
    </Button>
  );
}

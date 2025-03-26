"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HiHome } from "react-icons/hi";

// Props for the ConnectionPrompt component
interface ConnectionPromptProps {
  onOpenConnectHome: () => void;
}

// ConnectionIcon component
const ConnectionIcon = () => (
  <HiHome className="h-12 w-12 text-muted-foreground mb-2" />
);

// ConnectionTitle component
const ConnectionTitle = () => (
  <h2 className="text-xl font-semibold">Connect Your Smart Home</h2>
);

// ConnectionDescription component
const ConnectionDescription = () => (
  <p className="text-sm text-muted-foreground max-w-md mx-auto">
    Connect your smart home to monitor and control your devices, view analytics,
    and set up automation.
  </p>
);

// ConnectButton component
const ConnectButton = ({ onClick }: { onClick: () => void }) => (
  <div className="pt-4">
    <Button onClick={onClick}>Connect Home</Button>
  </div>
);

// Main ConnectionPrompt component
export function ConnectionPrompt({ onOpenConnectHome }: ConnectionPromptProps) {
  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <ConnectionIcon />
        <ConnectionTitle />
        <ConnectionDescription />
        <ConnectButton onClick={onOpenConnectHome} />
      </div>
    </Card>
  );
}

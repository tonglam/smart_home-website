"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HiHome } from "react-icons/hi";

interface HomeConnectionPromptProps {
  onOpenConnectHome: () => void;
}

export function HomeConnectionPrompt({
  onOpenConnectHome,
}: HomeConnectionPromptProps) {
  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <HiHome className="h-12 w-12 text-muted-foreground mb-2" />
        <h2 className="text-xl font-semibold">Connect Your Smart Home</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Connect your smart home to monitor and control your devices, view
          analytics, and set up automation.
        </p>
        <div className="pt-4">
          <Button onClick={onOpenConnectHome}>Connect Home</Button>
        </div>
      </div>
    </Card>
  );
}

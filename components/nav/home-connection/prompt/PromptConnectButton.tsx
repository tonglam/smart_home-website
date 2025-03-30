"use client";

import { Button } from "@/components/ui/button";

interface PromptConnectButtonProps {
  onClick: () => void;
}

export const PromptConnectButton = ({ onClick }: PromptConnectButtonProps) => (
  <div className="pt-4">
    <Button onClick={onClick}>Connect Home</Button>
  </div>
);

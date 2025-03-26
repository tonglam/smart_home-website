"use client";

import { ConnectionPrompt } from "@/components/dashboard/home-connection";

interface HomeConnectionPromptProps {
  onOpenConnectHome: () => void;
}

export function HomeConnectionPrompt({
  onOpenConnectHome,
}: HomeConnectionPromptProps) {
  return <ConnectionPrompt onOpenConnectHome={onOpenConnectHome} />;
}

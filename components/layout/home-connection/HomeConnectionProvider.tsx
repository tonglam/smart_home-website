"use client";

import { HomeConnectSection } from "@/components/navigation/home-connection/HomeConnectSection";
import { useState } from "react";

export interface HomeConnectionProviderProps {
  children: React.ReactNode;
  initialHomeId: string | null;
}

export function HomeConnectionProvider({
  children,
  initialHomeId,
}: HomeConnectionProviderProps) {
  const [isConnected, setIsConnected] = useState(Boolean(initialHomeId));

  return (
    <>
      <div className="w-full py-4 px-4 border-b">
        <div className="container mx-auto">
          <HomeConnectSection
            onConnectionChange={setIsConnected}
            initialHomeId={initialHomeId}
          />
        </div>
      </div>
      {isConnected && children}
    </>
  );
}

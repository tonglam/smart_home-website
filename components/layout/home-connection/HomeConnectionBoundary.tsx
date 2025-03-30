"use client";

import { HomeConnectSection } from "@/components/nav/home-connection/HomeConnectSection";

interface HomeConnectionBoundaryProps {
  initialHomeId: string | null;
}

export function HomeConnectionBoundary({
  initialHomeId,
}: HomeConnectionBoundaryProps) {
  return (
    <div className="w-full px-4 border-b">
      <div className="container mx-auto">
        <HomeConnectSection initialHomeId={initialHomeId} />
      </div>
    </div>
  );
}

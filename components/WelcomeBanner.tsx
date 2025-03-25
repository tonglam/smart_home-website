"use client";

import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export function WelcomeBanner() {
  const { user } = useUser();

  const displayName =
    user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "there";

  return (
    <Card className="relative overflow-hidden border-none shadow-sm bg-gradient-to-r from-card to-background">
      <div className="flex items-center gap-6 p-6">
        <div className="relative hidden sm:block">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border/50 shadow-sm">
            <Image
              src="/smart-home.svg"
              alt="Smart Home"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Hi {displayName}! Welcome to Your Smart Home
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor and control your smart home devices from one central
            dashboard. Quick access to all your connected devices and real-time
            monitoring.
          </p>
        </div>
      </div>
    </Card>
  );
}

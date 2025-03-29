import { Card } from "@/components/ui/card";
import Image from "next/image";

interface WelcomeBannerProps {
  displayName: string;
}

export function WelcomeBanner({ displayName }: WelcomeBannerProps) {
  return (
    <Card className="relative overflow-hidden border-none shadow-sm bg-gradient-to-r from-card to-background">
      <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="relative">
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
        <div className="flex-1 text-center sm:text-left">
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

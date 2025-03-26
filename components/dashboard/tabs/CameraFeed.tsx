"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Video } from "lucide-react";
import Image from "next/image";

const LIVE_STREAM_URL = "https://smart-home-hub.qitonglan.com";
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

export function CameraFeed() {
  const handleOpenLiveStream = () => {
    window.open(LIVE_STREAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
            </div>
            <span className="text-sm text-green-500">Live</span>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video relative">
            <Image
              src={PLACEHOLDER_IMAGE}
              alt="Live Camera Feed"
              fill
              className="object-cover"
              priority
            />
          </div>
          <Button
            size="icon"
            className="absolute bottom-4 right-4 h-12 w-12 rounded-full"
            onClick={handleOpenLiveStream}
            title="Open live stream in new window"
          >
            <Activity className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

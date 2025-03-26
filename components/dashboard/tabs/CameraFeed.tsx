"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { HiVideoCamera } from "react-icons/hi2";
import { IoMdPulse } from "react-icons/io";

export const CameraFeed = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiVideoCamera className="h-5 w-5" />
              <span>Front Door Camera</span>
            </div>
            <span className="text-sm text-green-500">Live</span>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
              alt="Front Door Camera Feed"
              fill
              className="object-cover"
              priority
            />
          </div>
          <Button
            size="icon"
            className="absolute bottom-4 right-4 h-12 w-12 rounded-full"
            onClick={() => window.open("tel:+1234567890")}
          >
            <IoMdPulse className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

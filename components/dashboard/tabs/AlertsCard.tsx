"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HiX } from "react-icons/hi";
import { IoMdPulse } from "react-icons/io";

interface AlertsCardProps {
  onClose: () => void;
}

export const AlertsCard = ({ onClose }: AlertsCardProps) => (
  <Card className="border-l-4 border-l-orange-500 relative">
    <div className="p-4 sm:p-6">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full"
        onClick={onClose}
      >
        <HiX className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 mb-3">
        <IoMdPulse className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold text-lg">Critical Alerts</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          No critical alerts at this time
        </p>
      </div>
    </div>
  </Card>
);

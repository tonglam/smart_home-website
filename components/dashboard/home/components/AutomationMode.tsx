"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface AutomationModeProps {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  showInfo?: boolean;
  isConnected: boolean;
  onToggleMode: () => void;
  onToggleInfo: () => void;
}

export function AutomationMode({
  name,
  description,
  icon: Icon,
  active,
  showInfo = false,
  isConnected,
  onToggleMode,
  onToggleInfo,
}: AutomationModeProps) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onToggleInfo}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
      {showInfo && (
        <p className="text-sm text-muted-foreground mb-3 bg-popover rounded-md p-2 shadow-sm">
          {description}
        </p>
      )}
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        className="w-full"
        disabled={!isConnected}
        onClick={onToggleMode}
      >
        {active ? "Active" : "Activate"}
      </Button>
    </div>
  );
}

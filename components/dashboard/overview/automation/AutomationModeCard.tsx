"use client";

import { AutomationMode } from "@/app/actions/dashboard/automation.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { Film, Home } from "lucide-react";
import { toast } from "sonner";

const iconComponents = {
  Home,
  Film,
} as const;

interface AutomationModeCardProps {
  mode: AutomationMode;
  currentMode: string;
  handleModeToggle: (mode: AutomationMode) => Promise<void>;
}

export function AutomationModeCard({
  mode,
  currentMode,
  handleModeToggle,
}: AutomationModeCardProps) {
  const isActive = mode.id === currentMode;
  const IconComponent =
    iconComponents[mode.icon as keyof typeof iconComponents] || null;

  const handleClick = async () => {
    try {
      await handleModeToggle(mode);
    } catch (error) {
      console.error("Failed to toggle mode:", error);
      toast.error("Failed to toggle mode. Please try again.");
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-colors",
        isActive && "border-primary"
      )}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          {IconComponent && <IconComponent className="h-5 w-5" />}
          <div className="font-medium">{mode.name}</div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{mode.description}</p>
      </CardHeader>
      <CardContent>
        <Button
          variant={isActive ? "default" : "outline"}
          className="w-full"
          onClick={handleClick}
          disabled={isActive}
        >
          {isActive ? "Active" : "Switch to this mode"}
        </Button>
      </CardContent>
    </Card>
  );
}

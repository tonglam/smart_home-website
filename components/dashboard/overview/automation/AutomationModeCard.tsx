"use client";

import { AutomationMode } from "@/app/actions/dashboard/automation.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { BookOpenIcon, FilmIcon, HomeIcon } from "lucide-react";
import { useState } from "react";

const iconComponents = {
  Home: HomeIcon,
  Film: FilmIcon,
  BookOpen: BookOpenIcon,
} as const;

interface AutomationModeCardProps {
  mode: AutomationMode;
  currentMode: string | null;
  isLoading: boolean;
  handleModeToggle: (mode: AutomationMode) => Promise<void>;
}

export function AutomationModeCard({
  mode,
  currentMode,
  isLoading,
  handleModeToggle,
}: AutomationModeCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const isActive = mode.id === currentMode;
  const optimisticIsActive = isToggling ? !isActive : isActive;
  const isDisabled = isLoading || isToggling;

  const IconComponent =
    iconComponents[mode.icon as keyof typeof iconComponents];

  const handleClick = async () => {
    if (isDisabled) return;

    setIsToggling(true);
    try {
      await handleModeToggle(mode);
    } catch (error) {
      console.error("Failed to toggle mode:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        optimisticIsActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        isDisabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "p-2 rounded-full shrink-0 mt-0.5",
            optimisticIsActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <IconComponent className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="font-medium">{mode.name}</div>
          <div className="text-sm text-muted-foreground">
            {mode.description}
          </div>
        </div>

        {/* Action button */}
        <Button
          variant={optimisticIsActive ? "default" : "outline"}
          size="sm"
          disabled={isDisabled}
          onClick={handleClick}
          className="shrink-0 self-start"
        >
          {isToggling
            ? isActive
              ? "Deactivating..."
              : "Activating..."
            : optimisticIsActive
              ? "Active"
              : "Enable"}
        </Button>
      </div>
    </div>
  );
}

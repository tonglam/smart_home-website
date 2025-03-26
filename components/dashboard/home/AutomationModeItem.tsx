"use client";

import { AutomationMode } from "@/app/actions/automation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpenIcon, FilmIcon, HomeIcon } from "lucide-react";
import { useState } from "react";

const iconComponents = {
  Home: HomeIcon,
  Film: FilmIcon,
  BookOpen: BookOpenIcon,
};

interface AutomationModeItemProps {
  mode: AutomationMode;
  isDisabled: boolean;
  isLoading: boolean;
  onModeClick: (mode: AutomationMode) => void;
}

export function AutomationModeItem({
  mode,
  isDisabled,
  isLoading,
  onModeClick,
}: AutomationModeItemProps) {
  const [showInfo, setShowInfo] = useState(false);
  const IconComponent =
    iconComponents[mode.icon as keyof typeof iconComponents];

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-colors",
        mode.active && "bg-accent",
        !isDisabled && "hover:bg-accent/50",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      onMouseEnter={() => !isDisabled && setShowInfo(true)}
      onMouseLeave={() => !isDisabled && setShowInfo(false)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-full",
            mode.active ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {IconComponent && <IconComponent className="h-4 w-4" />}
        </div>
        <div>
          <div className="font-medium">{mode.name}</div>
          {showInfo && !isDisabled && (
            <div className="text-sm text-muted-foreground">
              {mode.description}
            </div>
          )}
        </div>
      </div>
      <Button
        variant={mode.active ? "default" : "ghost"}
        size="sm"
        disabled={isDisabled}
        onClick={() => onModeClick(mode)}
        className={cn("min-w-[100px]", isLoading && "opacity-50 cursor-wait")}
      >
        {isLoading ? "..." : mode.active ? "Active" : "Activate"}
      </Button>
    </div>
  );
}

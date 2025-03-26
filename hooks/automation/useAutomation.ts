"use client";

import { defaultAutomationModes } from "@/lib/data";
import { BookOpen, Film, Home } from "lucide-react";
import { useState } from "react";

interface AutomationMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  showInfo?: boolean;
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Home":
      return Home;
    case "Film":
      return Film;
    case "BookOpen":
      return BookOpen;
    default:
      return Home;
  }
}

export function useAutomation() {
  const [modes, setModes] = useState<AutomationMode[]>(
    defaultAutomationModes.map((mode) => ({
      ...mode,
      icon: getIconComponent(mode.icon),
      showInfo: false,
    }))
  );

  const toggleMode = (modeId: string) => {
    setModes((modes) =>
      modes.map((mode) => ({
        ...mode,
        active: mode.id === modeId ? !mode.active : false,
      }))
    );
  };

  const toggleInfo = (modeId: string) => {
    setModes((modes) =>
      modes.map((mode) => ({
        ...mode,
        showInfo: mode.id === modeId ? !mode.showInfo : mode.showInfo,
      }))
    );
  };

  return {
    modes,
    toggleMode,
    toggleInfo,
  };
}

"use client";

import {
  getAutomationModes,
  type AutomationMode,
} from "@/app/actions/automation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  HiBookOpen,
  HiDesktopComputer,
  HiHome,
  HiInformationCircle,
  HiSparkles,
} from "react-icons/hi";

// Return icon component based on string name
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Home":
      return HiHome;
    case "Film":
      return HiDesktopComputer;
    case "BookOpen":
      return HiBookOpen;
    default:
      return HiHome;
  }
}

interface ModeWithIcon extends AutomationMode {
  iconComponent: React.ElementType;
}

// AutomationMode component for individual mode
const AutomationModeControl = ({
  mode,
  showInfo,
  onToggleInfo,
  onToggleMode,
}: {
  mode: ModeWithIcon;
  showInfo: boolean;
  onToggleInfo: () => void;
  onToggleMode: () => void;
}) => {
  const Icon = mode.iconComponent;

  return (
    <div className="p-3 bg-muted/50 rounded-lg relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{mode.name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onToggleInfo}
        >
          <HiInformationCircle className="h-4 w-4" />
        </Button>
      </div>
      {showInfo && (
        <p className="text-sm text-muted-foreground mb-3 bg-popover rounded-md p-2 shadow-sm">
          {mode.description}
        </p>
      )}
      <Button
        variant={mode.active ? "default" : "outline"}
        size="sm"
        className="w-full"
        onClick={onToggleMode}
      >
        {mode.active ? "Active" : "Activate"}
      </Button>
    </div>
  );
};

export function AutomationSection() {
  const [automationModes, setAutomationModes] = useState<ModeWithIcon[]>([]);
  const [infoStates, setInfoStates] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAutomationData = async () => {
      try {
        setIsLoading(true);
        const data = await getAutomationModes();
        // Convert string icon names to components
        const modesWithIcons = data.map((mode) => ({
          ...mode,
          iconComponent: getIconComponent(mode.icon),
        }));
        setAutomationModes(modesWithIcons);

        // Initialize info states
        const initialInfoStates: { [key: string]: boolean } = {};
        data.forEach((mode) => {
          initialInfoStates[mode.id] = false;
        });
        setInfoStates(initialInfoStates);
      } catch (error) {
        console.error("Error fetching automation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutomationData();
  }, []);

  const toggleMode = (modeId: string) => {
    setAutomationModes((modes) =>
      modes.map((mode) => ({
        ...mode,
        active: mode.id === modeId ? !mode.active : false,
      }))
    );
  };

  const toggleInfo = (modeId: string) => {
    setInfoStates((states) => ({
      ...states,
      [modeId]: !states[modeId],
    }));
  };

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6 order-2">
        <div className="flex items-center gap-2 mb-4">
          <HiSparkles className="h-5 w-5" />
          <h3 className="font-semibold">Automation</h3>
        </div>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 order-2">
      <div className="flex items-center gap-2 mb-4">
        <HiSparkles className="h-5 w-5" />
        <h3 className="font-semibold">Automation</h3>
      </div>
      <div className="space-y-3">
        {automationModes.map((mode) => (
          <AutomationModeControl
            key={mode.id}
            mode={mode}
            showInfo={infoStates[mode.id]}
            onToggleInfo={() => toggleInfo(mode.id)}
            onToggleMode={() => toggleMode(mode.id)}
          />
        ))}
      </div>
    </Card>
  );
}

import { AutomationSection } from "@/components/dashboard/overview/automation/AutomationSection";
import { LightingSection } from "@/components/dashboard/overview/lighting/LightingSection";
import { SecuritySection } from "@/components/dashboard/overview/security/SecuritySection";
import type {
  AutomationMode,
  Light,
  SecurityPoint,
} from "@/types/dashboard.types";

interface OverviewTabProps {
  lightDevices: Light[];
  automationModes: AutomationMode[];
  currentMode: string;
  securityPoints: SecurityPoint[];
  homeId: string;
}

export function OverviewTab({
  lightDevices,
  automationModes,
  currentMode,
  securityPoints,
  homeId,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Lighting and Automation - These are related as automation applies to lights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lighting Section - Takes 2/3 of space on larger screens */}
        <div className="lg:col-span-2">
          <LightingSection lightDevices={lightDevices} homeId={homeId} />
        </div>

        {/* Automation Section - Takes 1/3 of space on larger screens */}
        <div>
          <AutomationSection
            lightDevices={lightDevices}
            modes={automationModes}
            currentMode={currentMode}
            homeId={homeId}
          />
        </div>
      </div>

      {/* Security Section - Full width */}
      <div>
        <SecuritySection securityPoints={securityPoints} />
      </div>
    </div>
  );
}

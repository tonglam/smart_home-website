import { Tabs } from "@/components/ui/tabs";
import { DevicesTabContent } from "./device/DevicesTabContent";
import { AnalyticsTabsClient } from "./navigation/AnalyticsTabsClient";
import { SecurityTabContent } from "./security/SecurityTabContent";

export function AnalyticsTab() {
  return (
    <Tabs defaultValue="devices" className="space-y-6">
      <AnalyticsTabsClient />
      <div className="mt-4">
        <DevicesTabContent />
        <SecurityTabContent />
      </div>
    </Tabs>
  );
}

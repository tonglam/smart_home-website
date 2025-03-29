import { TabsContent } from "@/components/ui/tabs";
import { DeviceHealthCard } from "./DeviceHealthCard";
import { DeviceModeUsageChart } from "./DeviceModeUsageChart";

export function DevicesTabContent() {
  return (
    <TabsContent value="devices" className="space-y-6">
      <DeviceModeUsageChart />
      <DeviceHealthCard />
    </TabsContent>
  );
}

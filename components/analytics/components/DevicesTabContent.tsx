"use client";

import { TabsContent } from "@/components/ui/tabs";
import { DeviceHealthCard } from "../cards/DeviceHealthCard";
import { DeviceModeUsageChart } from "../charts/DeviceModeUsageChart";

export function DevicesTabContent() {
  return (
    <TabsContent value="devices" className="space-y-6">
      <DeviceModeUsageChart />
      <DeviceHealthCard />
    </TabsContent>
  );
}

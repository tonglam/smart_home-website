"use client";

import { Tabs } from "@/components/ui/tabs";
import {
  AnalyticsTabs,
  DevicesTabContent,
  SecurityTabContent,
} from "./components";

export function AnalyticsOverview() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Tabs defaultValue="devices" className="space-y-4">
          <AnalyticsTabs />
          <DevicesTabContent />
          <SecurityTabContent />
        </Tabs>
      </div>
    </div>
  );
}

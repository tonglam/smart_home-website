"use client";

import { TabsContent } from "@/components/ui/tabs";
import { SecurityRecommendationsCard } from "../cards/SecurityRecommendationsCard";
import { SecurityEventsChart } from "../charts/SecurityEventsChart";

export function SecurityTabContent() {
  return (
    <TabsContent value="security" className="space-y-6">
      <SecurityEventsChart />
      <SecurityRecommendationsCard />
    </TabsContent>
  );
}

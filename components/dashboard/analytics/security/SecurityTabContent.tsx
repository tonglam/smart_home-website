import { TabsContent } from "@/components/ui/tabs";
import { SecurityEventsChart } from "./SecurityEventsChart";
import { SecurityRecommendationsCard } from "./SecurityRecommendationsCard";

export function SecurityTabContent() {
  return (
    <TabsContent value="security" className="space-y-6">
      <SecurityEventsChart />
      <SecurityRecommendationsCard />
    </TabsContent>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AnalyticsTabsClient } from "./navigation/AnalyticsTabsClient";

// Dynamically import tab contents with no SSR
const DynamicDevicesTabContent = dynamic(
  () =>
    import("./device/DevicesTabContent").then((mod) => mod.DevicesTabContent),
  { ssr: false }
);
const DynamicSecurityTabContent = dynamic(
  () =>
    import("./security/SecurityTabContent").then(
      (mod) => mod.SecurityTabContent
    ),
  { ssr: false }
);

export function AnalyticsTab() {
  return (
    <Tabs defaultValue="devices" className="space-y-6">
      <AnalyticsTabsClient />
      <div className="mt-4">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <TabsContent value="devices">
            <DynamicDevicesTabContent />
          </TabsContent>
          <TabsContent value="security">
            <DynamicSecurityTabContent />
          </TabsContent>
        </Suspense>
      </div>
    </Tabs>
  );
}

import { ActivityFeed } from "@/components/dashboard/activity/ActivityFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { DashboardData, TabValue } from "@/types/dashboard.types";
import { Suspense } from "react";
import { AnalyticsTab } from "./analytics/AnalyticsTab";
import { MonitoringTab } from "./monitoring/MonitoringTab";
import { OverviewTab } from "./overview/OverviewTab";
import { TabContentWrapper } from "./tabs/TabContentWrapper";
import { DashboardTabNavigation } from "./tabs/TabNavigation";
import { TabSkeleton } from "./tabs/TabSkeleton";
import { WelcomeBanner } from "./welcome/WelcomeBanner";

interface DashboardProps {
  data: DashboardData;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function Dashboard({ data, searchParams }: DashboardProps) {
  const tab = searchParams.tab as TabValue | undefined;
  const activeTab = tab || "overview";

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Welcome Banner */}
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <WelcomeBanner displayName={data.userDisplayName} />
        </Suspense>

        {/* Tabs Section */}
        <Tabs defaultValue={activeTab} value={activeTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <Suspense fallback={<Skeleton className="h-10 w-[300px]" />}>
              <DashboardTabNavigation />
            </Suspense>
          </div>

          <div className="relative min-h-[400px]">
            {/* Use separate Suspense boundaries for each tab to allow individual loading */}
            <TabContentWrapper activeTab={activeTab} targetTab="overview">
              <Suspense fallback={<TabSkeleton type="overview" />}>
                <TabsContent
                  value="overview"
                  className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
                >
                  <OverviewTab
                    lightDevices={data.lightDevices}
                    automationModes={data.automationModes}
                    currentMode={data.currentMode}
                    securityPoints={data.securityPoints}
                    homeId={data.homeId}
                  />
                </TabsContent>
              </Suspense>
            </TabContentWrapper>

            <TabContentWrapper activeTab={activeTab} targetTab="monitoring">
              <Suspense fallback={<TabSkeleton type="monitoring" />}>
                <TabsContent
                  value="monitoring"
                  className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
                >
                  <MonitoringTab alerts={data.alerts} />
                </TabsContent>
              </Suspense>
            </TabContentWrapper>

            <TabContentWrapper activeTab={activeTab} targetTab="analytics">
              <Suspense fallback={<TabSkeleton type="analytics" />}>
                <TabsContent
                  value="analytics"
                  className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
                >
                  <AnalyticsTab />
                </TabsContent>
              </Suspense>
            </TabContentWrapper>
          </div>
        </Tabs>

        {/* Activity Feed */}
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <ActivityFeed activities={data.activities} />
        </Suspense>
      </div>
    </div>
  );
}

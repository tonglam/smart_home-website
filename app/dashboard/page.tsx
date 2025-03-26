import { MainDashboard } from "@/components/dashboard";
import { TabLoadingFallback } from "@/components/dashboard/tabs/components/TabLoadingFallback";
import { Suspense } from "react";

// Set revalidation for static regeneration
export const revalidate = 60; // Revalidate this page every 60 seconds

export default function DashboardPage() {
  return (
    <Suspense fallback={<TabLoadingFallback />}>
      <MainDashboard />
    </Suspense>
  );
}

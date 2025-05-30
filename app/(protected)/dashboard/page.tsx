/**
 * Protected dashboard page that displays smart home monitoring and control interface.
 * Handles user authentication and data fetching for the dashboard.
 */
import { Dashboard } from "@/components/dashboard/Dashboard";
import {
  fetchData,
  getDefaultDashboardData,
  transformData,
} from "@/lib/data/dashboard.data";
import type { SearchParams } from "@/types/dashboard.types";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Page metadata for SEO and social sharing
export const metadata: Metadata = {
  title: "Dashboard - Smart Home System",
  description: "Monitor and control your smart home devices",
  authors: [{ name: "Qitong Lan" }],
  openGraph: {
    title: "Dashboard - Smart Home System",
    description: "Monitor and control your smart home devices",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function DashboardPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const user = await currentUser();

  // Redirect to sign in if no authenticated user
  if (!user) {
    redirect("/signin");
  }

  const homeId = user.publicMetadata.homeId as string;
  const userDisplayName =
    user.firstName || user.emailAddresses[0]?.emailAddress || "there";

  try {
    // Return default dashboard if no home is associated
    if (!homeId) {
      return (
        <Dashboard
          data={getDefaultDashboardData(userDisplayName)}
          searchParams={searchParams}
        />
      );
    }

    // Fetch and transform dashboard data for the user's home
    const rawData = await fetchData(homeId);
    const dashboardData = await transformData(
      rawData,
      homeId,
      user.id,
      userDisplayName
    );

    return <Dashboard data={dashboardData} searchParams={searchParams} />;
  } catch (error) {
    console.error("Error in DashboardPage:", error);
    // Fallback to default dashboard on error
    return (
      <Dashboard
        data={getDefaultDashboardData(userDisplayName)}
        searchParams={searchParams}
      />
    );
  }
}

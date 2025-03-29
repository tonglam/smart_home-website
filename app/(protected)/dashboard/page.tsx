import { Dashboard } from "@/components/dashboard/Dashboard";
import {
  fetchData,
  getDefaultDashboardData,
  transformData,
} from "@/lib/data/dashboard.data";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const user = await currentUser();

  if (!user) {
    redirect("/signin");
  }

  const homeId = user.publicMetadata.homeId as string;
  const userDisplayName =
    user.firstName || user.emailAddresses[0]?.emailAddress || "there";

  try {
    if (!homeId) {
      return (
        <Dashboard
          data={getDefaultDashboardData(userDisplayName)}
          searchParams={searchParams}
        />
      );
    }

    const rawData = await fetchData(homeId);
    const dashboardData = transformData(rawData, homeId, userDisplayName);

    return <Dashboard data={dashboardData} searchParams={searchParams} />;
  } catch (error) {
    console.error("Error in DashboardPage:", error);
    return (
      <Dashboard
        data={getDefaultDashboardData(userDisplayName)}
        searchParams={searchParams}
      />
    );
  }
}

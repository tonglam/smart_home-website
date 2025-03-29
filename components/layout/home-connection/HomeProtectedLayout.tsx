// Server Component by default (no "use client" directive)
import { Skeleton } from "@/components/ui/skeleton";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { HomeConnectionBoundary } from "./HomeConnectionBoundary";
import { HomeConnectionSkeleton } from "./HomeConnectionSkeleton";

interface HomeProtectedLayoutProps {
  children: React.ReactNode;
}

export async function HomeProtectedLayout({
  children,
}: HomeProtectedLayoutProps) {
  const user = await currentUser();
  const initialHomeId = (user?.publicMetadata?.homeId as string) || null;

  return (
    <>
      <Suspense fallback={<HomeConnectionSkeleton />}>
        <HomeConnectionBoundary initialHomeId={initialHomeId} />
      </Suspense>
      {/* Children remain in server context */}
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        {initialHomeId ? children : null}
      </Suspense>
    </>
  );
}

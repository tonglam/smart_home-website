"use client";

import { MainLayout } from "@/components/layout";
import { useNavigation } from "@/hooks/auth/useNavigation";
import { SupportCard } from "./components/SupportCard";

export function SupportContent() {
  const { isSignedIn, isHomeConnected, handleOpenConnectHome } =
    useNavigation();

  return (
    <MainLayout
      isSignedIn={isSignedIn}
      isHomeConnected={isHomeConnected}
      onOpenConnectHome={handleOpenConnectHome}
    >
      <main
        className="flex-1 flex items-center justify-center py-12 px-4"
        role="main"
        aria-labelledby="support-title"
      >
        <div className="w-full max-w-4xl">
          <SupportCard />
        </div>
      </main>
    </MainLayout>
  );
}

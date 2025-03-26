"use client";

import ConnectHomeDialog from "@/components/ConnectHomeDialog";
import { Navbar } from "@/components/navigation/Navbar";
import { useNavigation } from "@/hooks/auth/useNavigation";

export function NavbarWrapper() {
  const {
    isSignedIn,
    isHomeConnected,
    showConnectHome,
    setShowConnectHome,
    handleOpenConnectHome,
  } = useNavigation();

  return (
    <>
      <ConnectHomeDialog
        open={showConnectHome}
        onOpenChange={setShowConnectHome}
        onConnect={() => setShowConnectHome(false)}
      />

      <Navbar
        isSignedIn={isSignedIn}
        isHomeConnected={isHomeConnected}
        onOpenConnectHome={handleOpenConnectHome}
      />
    </>
  );
}

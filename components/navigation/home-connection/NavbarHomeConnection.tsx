"use client";

import { useAuthNavigation } from "@/components/auth/AuthNavigationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { HomeLink } from "../links/HomeLink";

export function NavbarHomeConnection() {
  const { isHomeConnected } = useAuth();
  const { openConnectHome } = useAuthNavigation();

  return <HomeLink isConnected={isHomeConnected} onClick={openConnectHome} />;
}

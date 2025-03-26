"use client";

import { Navbar as OptimizedNavbar } from "@/components/navigation";

interface NavbarProps {
  isSignedIn: boolean;
  isHomeConnected: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenConnectHome: () => void;
}

export function Navbar(props: NavbarProps) {
  return <OptimizedNavbar {...props} />;
}

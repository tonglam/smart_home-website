"use client";

import { ClerkUserAdapter as OptimizedClerkUserAdapter } from "@/components/auth";

interface ClerkUserAdapterProps {
  onSignOut: () => void;
}

export function ClerkUserAdapter({ onSignOut }: ClerkUserAdapterProps) {
  return <OptimizedClerkUserAdapter onSignOut={onSignOut} />;
}

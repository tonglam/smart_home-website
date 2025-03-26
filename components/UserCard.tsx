"use client";

import { UserCard as OptimizedUserCard } from "@/components/profile";

export interface UserCardProps {
  name: string;
  email: string;
  imageUrl?: string;
  onSignOut: () => void;
  onEmailChange: (email: string) => Promise<void>;
}

export function UserCard(props: UserCardProps) {
  return <OptimizedUserCard {...props} />;
}

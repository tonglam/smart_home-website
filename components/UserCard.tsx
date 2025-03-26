"use client";

import { UserCard as OptimizedUserCard } from "@/components/profile";

interface UserCardProps {
  name: string;
  email: string;
  imageUrl?: string;
  onSignOut: () => void;
}

export function UserCard(props: UserCardProps) {
  return <OptimizedUserCard {...props} />;
}

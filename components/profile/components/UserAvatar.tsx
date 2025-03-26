"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export interface UserAvatarProps {
  /** The user's display name */
  name: string;
  /** Optional URL for the user's avatar image */
  imageUrl?: string;
  /** Optional CSS class name */
  className?: string;
}

export function UserAvatar({ name, imageUrl, className }: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={className}>
      {imageUrl && !hasError ? (
        <AvatarImage
          src={imageUrl}
          alt={`${name}'s avatar`}
          onError={() => setHasError(true)}
        />
      ) : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

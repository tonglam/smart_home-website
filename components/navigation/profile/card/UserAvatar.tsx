"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

export interface UserAvatarProps {
  name: string;
  imageUrl?: string;
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
        <div className="aspect-square h-full w-full relative">
          <Image
            src={imageUrl}
            alt={`${name}'s avatar`}
            fill
            sizes="32px"
            priority
            className="rounded-full object-cover"
            onError={() => setHasError(true)}
          />
        </div>
      ) : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

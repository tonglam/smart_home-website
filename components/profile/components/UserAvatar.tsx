"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
}

export function UserAvatar({ name, imageUrl }: UserAvatarProps) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={imageUrl} alt={name} />
      <AvatarFallback>
        <FaUser className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}

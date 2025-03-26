"use client";

interface UserInfoProps {
  name: string;
  email: string;
}

export function UserInfo({ name, email }: UserInfoProps) {
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-xs leading-none text-muted-foreground">{email}</p>
    </div>
  );
}

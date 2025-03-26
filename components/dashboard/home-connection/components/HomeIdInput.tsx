"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HomeIdInputProps {
  homeId: string;
  setHomeId: (value: string) => void;
  isConnecting: boolean;
}

export function HomeIdInput({
  homeId,
  setHomeId,
  isConnecting,
}: HomeIdInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="homeId">Home ID</Label>
      <Input
        id="homeId"
        placeholder="Enter your home ID"
        value={homeId}
        onChange={(e) => setHomeId(e.target.value)}
        disabled={isConnecting}
      />
    </div>
  );
}

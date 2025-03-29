"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DialogHomeIdInputProps {
  homeId: string;
  setHomeId: (value: string) => void;
  isConnecting: boolean;
  currentHomeId?: string;
}

export function DialogHomeIdInput({
  homeId,
  setHomeId,
  isConnecting,
  currentHomeId,
}: DialogHomeIdInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="homeId">
        {currentHomeId ? "Current Home ID" : "Home ID"}
      </Label>
      <Input
        id="homeId"
        placeholder={currentHomeId ? "Enter new home ID" : "Enter your home ID"}
        value={homeId}
        onChange={(e) => setHomeId(e.target.value)}
        disabled={isConnecting}
      />
    </div>
  );
}

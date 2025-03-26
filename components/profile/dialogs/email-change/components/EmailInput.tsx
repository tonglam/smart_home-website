"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
}

export function EmailInput({ email, setEmail, isSubmitting }: EmailInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">New Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter new email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        required
      />
    </div>
  );
}

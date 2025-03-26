"use client";

import { EmailChangeDialog as OptimizedEmailChangeDialog } from "@/components/profile";

interface EmailChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailChange: (email: string) => void;
  currentEmail: string;
}

export function EmailChangeDialog({
  open,
  onOpenChange,
  onEmailChange,
  currentEmail,
}: EmailChangeDialogProps) {
  return (
    <OptimizedEmailChangeDialog
      open={open}
      onOpenChange={onOpenChange}
      onEmailChange={onEmailChange}
      currentEmail={currentEmail}
    />
  );
}

"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EmailDialogHeader() {
  return (
    <DialogHeader>
      <DialogTitle>Change Email</DialogTitle>
      <DialogDescription id="email-change-description">
        Enter your new email address below. You will need to verify this email
        before the change takes effect.
      </DialogDescription>
    </DialogHeader>
  );
}

"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogHeaderContentProps {
  currentHomeId?: string;
}

export function DialogHeaderContent({
  currentHomeId,
}: DialogHeaderContentProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {currentHomeId ? "Update Home Connection" : "Connect Your Smart Home"}
      </DialogTitle>
      <DialogDescription id="connect-home-description">
        {currentHomeId
          ? "Update your home ID to connect to a different smart home system."
          : "Enter your home ID to connect and manage your smart home devices."}
      </DialogDescription>
    </DialogHeader>
  );
}

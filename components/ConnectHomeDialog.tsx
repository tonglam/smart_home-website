"use client";

import { ConnectionDialog } from "@/components/dashboard/home-connection";
import { FC } from "react";

interface ConnectHomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (homeId: string) => void;
  currentHomeId?: string;
}

const ConnectHomeDialog: FC<ConnectHomeDialogProps> = ({
  open,
  onOpenChange,
  onConnect,
  currentHomeId,
}) => {
  return (
    <ConnectionDialog
      open={open}
      onOpenChange={onOpenChange}
      onConnect={onConnect}
      currentHomeId={currentHomeId}
    />
  );
};

export default ConnectHomeDialog;

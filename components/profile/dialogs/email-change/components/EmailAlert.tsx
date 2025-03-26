"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaBell } from "react-icons/fa";

export function EmailAlert() {
  return (
    <Alert>
      <FaBell className="h-4 w-4" />
      <AlertDescription>
        This email address will be used to receive important alerts and
        notifications from your smart home devices.
      </AlertDescription>
    </Alert>
  );
}

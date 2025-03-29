"use client";

import { Button } from "@/components/ui/button";
import { FaExclamationCircle } from "react-icons/fa";

interface ContractFormActionsProps {
  isSubmitting: boolean;
}

export function ContractFormActions({
  isSubmitting,
}: ContractFormActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending Report..." : "Send Report"}
      </Button>

      <div className="text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <FaExclamationCircle className="h-4 w-4" />
          All fields marked with * are required
        </p>
      </div>
    </div>
  );
}

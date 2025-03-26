"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DialogActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
}

export function EmailDialogActions({
  isSubmitting,
  onClose,
}: DialogActionsProps) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  );
}

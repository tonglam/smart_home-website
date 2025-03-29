import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DialogFooterActionsProps {
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  emailUnchanged: boolean;
}

export function DialogFooterActions({
  onOpenChange,
  isSubmitting,
  emailUnchanged,
}: DialogFooterActionsProps) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || emailUnchanged}>
        {isSubmitting ? "Updating..." : "Update Email"}
      </Button>
    </DialogFooter>
  );
}

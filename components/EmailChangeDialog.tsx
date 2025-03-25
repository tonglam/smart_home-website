"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  const [email, setEmail] = useState(currentEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || email === currentEmail) return;

    setIsSubmitting(true);
    try {
      await onEmailChange(email);
      toast.success("Email updated successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="email-change-description"
      >
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
          <DialogDescription id="email-change-description">
            Enter your new email address below. You will need to verify this
            email before the change takes effect.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert className="bg-muted/50">
            <div className="flex items-start">
              <BellRing className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
              <AlertDescription className="text-muted-foreground text-sm">
                This email address will be used to receive important alerts and
                notifications from your smart home devices.
              </AlertDescription>
            </div>
          </Alert>

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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || email === currentEmail}
            >
              {isSubmitting ? "Updating..." : "Update Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

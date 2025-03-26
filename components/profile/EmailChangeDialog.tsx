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
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { toast } from "sonner";

// Props interface
interface EmailChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailChange: (email: string) => void;
  currentEmail: string;
}

// Alert component for notification info
const EmailNotificationAlert = () => (
  <Alert className="bg-muted/50">
    <div className="flex items-start">
      <FaBell className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
      <AlertDescription className="text-muted-foreground text-sm">
        This email address will be used to receive important alerts and
        notifications from your smart home devices.
      </AlertDescription>
    </div>
  </Alert>
);

// Header component
const DialogHeaderComponent = () => (
  <DialogHeader>
    <DialogTitle>Change Email</DialogTitle>
    <DialogDescription id="email-change-description">
      Enter your new email address below. You will need to verify this email
      before the change takes effect.
    </DialogDescription>
  </DialogHeader>
);

// Email input field component
const EmailInputField = ({
  email,
  setEmail,
  isSubmitting,
}: {
  email: string;
  setEmail: (value: string) => void;
  isSubmitting: boolean;
}) => (
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

// Dialog footer with action buttons
const DialogFooterActions = ({
  onOpenChange,
  isSubmitting,
  emailUnchanged,
}: {
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  emailUnchanged: boolean;
}) => (
  <DialogFooter>
    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
      Cancel
    </Button>
    <Button type="submit" disabled={isSubmitting || emailUnchanged}>
      {isSubmitting ? "Updating..." : "Update Email"}
    </Button>
  </DialogFooter>
);

// Main component
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
        <DialogHeaderComponent />
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailNotificationAlert />
          <EmailInputField
            email={email}
            setEmail={setEmail}
            isSubmitting={isSubmitting}
          />
          <DialogFooterActions
            onOpenChange={onOpenChange}
            isSubmitting={isSubmitting}
            emailUnchanged={email === currentEmail}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

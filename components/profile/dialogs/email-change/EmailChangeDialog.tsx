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
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBell } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";

const emailChangeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

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
      <FaBell
        className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground"
        aria-hidden="true"
      />
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
  form,
  isSubmitting,
}: {
  form: ReturnType<typeof useForm<EmailChangeFormData>>;
  isSubmitting: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-2">
      <Label htmlFor="email">New Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter new email address"
        disabled={isSubmitting}
        aria-describedby={errors.email ? "email-error" : undefined}
        {...register("email")}
      />
      {errors.email && (
        <p id="email-error" className="text-sm text-destructive">
          {errors.email.message}
        </p>
      )}
    </div>
  );
};

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

// Main component
export function EmailChangeDialog({
  open,
  onOpenChange,
  onEmailChange,
  currentEmail,
}: EmailChangeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      email: currentEmail,
    },
  });

  const onSubmit = useCallback(
    async (values: EmailChangeFormData) => {
      if (values.email === currentEmail) return;
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        await onEmailChange(values.email);
        toast.success("Email updated successfully", {
          description: "Please check your inbox for verification.",
          duration: 5000,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update email:", error);
        toast.error("Failed to update email", {
          description: "Please try again or contact support.",
          duration: 7000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentEmail, isSubmitting, onEmailChange, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="email-change-description"
      >
        <DialogHeaderComponent />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmailNotificationAlert />
            <EmailInputField form={form} isSubmitting={isSubmitting} />
            <DialogFooterActions
              onOpenChange={onOpenChange}
              isSubmitting={isSubmitting}
              emailUnchanged={form.watch("email") === currentEmail}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

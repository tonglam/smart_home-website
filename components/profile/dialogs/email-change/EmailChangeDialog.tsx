"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  EmailAlert,
  EmailDialogActions,
  EmailDialogHeader,
  EmailInput,
} from "./components";

interface EmailChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function EmailChangeDialog({
  isOpen,
  onClose,
  onSubmit,
}: EmailChangeDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      toast({
        title: "Success",
        description: "Email change request sent. Please check your inbox.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <EmailDialogHeader />
          <div className="space-y-4 py-4">
            <EmailAlert />
            <EmailInput
              email={email}
              setEmail={setEmail}
              isSubmitting={isSubmitting}
            />
          </div>
          <EmailDialogActions isSubmitting={isSubmitting} onClose={onClose} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

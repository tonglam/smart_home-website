import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useEmailChange } from "@/hooks/profile/useEmailChange";
import { DialogFooterActions } from "./DialogFooter";
import { DialogHeaderComponent } from "./DialogHeader";
import { EmailInputField } from "./EmailInputField";
import { EmailNotificationAlert } from "./EmailNotificationAlert";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailChange: (email: string) => Promise<void>;
  currentEmail: string;
}

export function EmailDialog({
  open,
  onOpenChange,
  onEmailChange,
  currentEmail,
}: EmailDialogProps) {
  const { form, isSubmitting, handleEmailChange } = useEmailChange(
    currentEmail,
    onEmailChange
  );

  const emailUnchanged =
    form.watch("email") === currentEmail || form.watch("email") === "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeaderComponent />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailChange)}
            className="space-y-4"
          >
            <EmailInputField form={form} isSubmitting={isSubmitting} />
            <EmailNotificationAlert />
            <DialogFooterActions
              onOpenChange={onOpenChange}
              isSubmitting={isSubmitting}
              emailUnchanged={emailUnchanged}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { emailChangeSchema, type EmailChangeFormData } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface UseEmailChangeReturn {
  form: ReturnType<typeof useForm<EmailChangeFormData>>;
  isSubmitting: boolean;
  error: Error | null;
  handleEmailChange: (data: EmailChangeFormData) => Promise<void>;
}

/**
 * Hook for handling notification email changes in the smart home system
 * This updates the notification email in D1 database, not the user's auth email
 */
export function useEmailChange(
  currentEmail: string,
  onEmailChange: (email: string) => Promise<void>
): UseEmailChangeReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      email: currentEmail || "",
    },
  });

  const handleEmailChange = async (data: EmailChangeFormData) => {
    if (data.email === currentEmail) {
      form.setError("email", {
        type: "manual",
        message: "New notification email must be different from current one",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onEmailChange(data.email);
      form.reset({ email: data.email }); // Update form with new email
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to change notification email")
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    error,
    handleEmailChange,
  };
}

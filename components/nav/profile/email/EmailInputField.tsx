import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type EmailChangeFormData } from "@/schemas";
import { useForm } from "react-hook-form";

interface EmailInputFieldProps {
  form: ReturnType<typeof useForm<EmailChangeFormData>>;
  isSubmitting: boolean;
}

export function EmailInputField({ form, isSubmitting }: EmailInputFieldProps) {
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
}

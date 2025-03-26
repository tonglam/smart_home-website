"use client";

import { sendContactEmail } from "@/app/actions/email";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaExclamationCircle } from "react-icons/fa";
import { toast } from "sonner";
import {
  DescriptionField,
  EmailField,
  FormHeader,
  FullNameField,
  PhoneField,
  PriorityField,
  SubjectField,
} from "./fields";

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  className?: string;
}

const FormActions = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <div className="flex flex-col gap-4">
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? "Sending Report..." : "Send Report"}
    </Button>

    <div className="text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <FaExclamationCircle className="h-4 w-4" aria-hidden="true" />
        <span>All fields marked with * are required</span>
      </p>
    </div>
  </div>
);

export function ContactForm({ onSubmitSuccess, className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      priority: "medium",
      description: "",
    },
  });

  const onSubmit = useCallback(
    async (values: ContactFormData) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        await sendContactEmail(values);
        toast.success("Your report has been submitted successfully", {
          description: "We'll get back to you within 24-48 hours.",
          duration: 5000,
        });
        form.reset();
        onSubmitSuccess?.();
      } catch (error) {
        console.error("Failed to submit form:", error);
        toast.error("Failed to submit report", {
          description: "Please try again or contact support directly.",
          duration: 7000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSubmitSuccess, isSubmitting]
  );

  return (
    <Card className={className}>
      <div className="space-y-6 p-6">
        <FormHeader />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            aria-label="Contact support form"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FullNameField form={form} />
              <EmailField form={form} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PhoneField form={form} />
              <PriorityField form={form} />
            </div>

            <SubjectField form={form} />
            <DescriptionField form={form} />
            <FormActions isSubmitting={isSubmitting} />
          </form>
        </Form>
      </div>
    </Card>
  );
}

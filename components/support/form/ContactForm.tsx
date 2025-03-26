"use client";

import { sendContactEmail } from "@/app/actions/email";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  DescriptionField,
  EmailField,
  FormActions,
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

  const onSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await sendContactEmail(values);
      toast.success("Your report has been submitted successfully", {
        description: "We'll get back to you within 24-48 hours.",
      });
      form.reset();
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit report", {
        description: "Please try again or contact support directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`p-6 ${className || ""}`}>
      <div className="space-y-6">
        <FormHeader />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

"use client";

import { sendContactEmail } from "@/app/actions/support/email.action";
import { ContractFormHeader } from "@/components/support/form/fields/ContractFormHeader";
import { DescriptionField } from "@/components/support/form/fields/input/DescriptionField";
import { FullNameField } from "@/components/support/form/fields/input/NameField";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/schemas/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ContractFormActions } from "./fields/ContractFormActions";
import { EmailField } from "./fields/input/EmailField";
import { PhoneField } from "./fields/input/PhoneField";
import { PriorityField } from "./fields/input/PriorityField";
import { SubjectField } from "./fields/input/SubjectField";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      priority: "low",
      description: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      const result = await sendContactEmail(data);

      if (result.success) {
        toast.success(
          "Message sent successfully! Check your email for confirmation."
        );
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="space-y-6 p-6">
        <ContractFormHeader />
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
            <ContractFormActions isSubmitting={isSubmitting} />
          </form>
        </Form>
      </div>
    </Card>
  );
}

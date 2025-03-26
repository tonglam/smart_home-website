"use client";

import { sendContactEmail } from "@/app/actions/email";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { FaExclamationCircle } from "react-icons/fa";
import { toast } from "sonner";

// FormHeader component for the form header section
const FormHeader = () => (
  <div>
    <h2 className="text-2xl font-semibold">Report an Issue</h2>
    <p className="text-muted-foreground mt-2">
      Fill out the form below and we&apos;ll get back to you within 24-48 hours.
    </p>
  </div>
);

// FullNameField component
const FullNameField = ({ form }: { form: UseFormReturn<ContactFormData> }) => (
  <FormField
    control={form.control}
    name="fullName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Full Name *</FormLabel>
        <FormControl>
          <Input placeholder="John Doe" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// EmailField component
const EmailField = ({ form }: { form: UseFormReturn<ContactFormData> }) => (
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email Address *</FormLabel>
        <FormControl>
          <Input type="email" placeholder="john@example.com" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// PhoneField component
const PhoneField = ({ form }: { form: UseFormReturn<ContactFormData> }) => (
  <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Phone Number (Optional)</FormLabel>
        <FormControl>
          <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// PriorityField component
const PriorityField = ({ form }: { form: UseFormReturn<ContactFormData> }) => (
  <FormField
    control={form.control}
    name="priority"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Priority Level *</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

// SubjectField component
const SubjectField = ({ form }: { form: UseFormReturn<ContactFormData> }) => (
  <FormField
    control={form.control}
    name="subject"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Subject *</FormLabel>
        <FormControl>
          <Input placeholder="Brief description of the issue" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// DescriptionField component
const DescriptionField = ({
  form,
}: {
  form: UseFormReturn<ContactFormData>;
}) => (
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Description *</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Please provide detailed information about your issue..."
            className="min-h-[120px]"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// FormActions component
const FormActions = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <div className="flex flex-col gap-4">
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? "Sending Report..." : "Send Report"}
    </Button>

    <div className="text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <FaExclamationCircle className="h-4 w-4" />
        All fields marked with * are required
      </p>
    </div>
  </div>
);

interface ContactFormOptimizedProps {
  onSubmitSuccess?: () => void;
  className?: string;
}

export function ContactFormOptimized({
  onSubmitSuccess,
  className,
}: ContactFormOptimizedProps) {
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

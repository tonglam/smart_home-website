"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { type ContactFormData } from "@/schemas/contact.schema";
import { UseFormReturn } from "react-hook-form";

interface DescriptionFieldProps {
  form: UseFormReturn<ContactFormData>;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
  return (
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
}

"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ContactFormData } from "@/schemas/contact.schema";
import { UseFormReturn } from "react-hook-form";

interface EmailFieldProps {
  form: UseFormReturn<ContactFormData>;
}

export function EmailField({ form }: EmailFieldProps) {
  return (
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
}

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

interface FullNameFieldProps {
  form: UseFormReturn<ContactFormData>;
}

export function FullNameField({ form }: FullNameFieldProps) {
  return (
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
}

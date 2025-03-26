"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ContactFormData } from "@/lib/schemas/contact";
import { type UseFormReturn } from "react-hook-form";

interface PhoneFieldProps {
  form: UseFormReturn<ContactFormData>;
}

export function PhoneField({ form }: PhoneFieldProps) {
  return (
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
}

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
import { type UseFormReturn } from "react-hook-form";

interface SubjectFieldProps {
  form: UseFormReturn<ContactFormData>;
}

export function SubjectField({ form }: SubjectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subject</FormLabel>
          <FormControl>
            <Input placeholder="How can we help you?" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

"use client";

import {
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
import { type ContactFormData } from "@/lib/schemas/contact";
import { type UseFormReturn } from "react-hook-form";

interface FormFieldProps {
  form: UseFormReturn<ContactFormData>;
}

export function FullNameField({ form }: FormFieldProps) {
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

export function EmailField({ form }: FormFieldProps) {
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

export function PhoneField({ form }: FormFieldProps) {
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

export function PriorityField({ form }: FormFieldProps) {
  return (
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
}

export function SubjectField({ form }: FormFieldProps) {
  return (
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
}

export function DescriptionField({ form }: FormFieldProps) {
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

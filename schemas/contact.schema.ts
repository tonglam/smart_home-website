/**
 * Contact form validation schema using Zod
 * Defines validation rules for the support contact form
 */
import { z } from "zod";

/**
 * Schema for validating contact form submissions
 * Includes required fields and validation rules for each field
 */
export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  priority: z.enum(["low", "medium", "high"]),
  description: z
    .string()
    .min(10, "Please provide more details (minimum 10 characters)"),
});

/** Type definition inferred from the contact form schema */
export type ContactFormData = z.infer<typeof contactFormSchema>;

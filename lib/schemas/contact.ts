import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  priority: z.enum(["low", "medium", "high"]),
  description: z
    .string()
    .min(20, "Please provide more details (minimum 20 characters)"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

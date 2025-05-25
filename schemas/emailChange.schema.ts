/**
 * Email change form validation schema using Zod
 * Defines validation rules for updating notification email
 */
import { z } from "zod";

/**
 * Schema for validating email change requests
 * Ensures email is provided and properly formatted
 */
export const emailChangeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

/** Type definition inferred from the email change schema */
export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

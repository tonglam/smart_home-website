import { z } from "zod";

export const emailChangeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

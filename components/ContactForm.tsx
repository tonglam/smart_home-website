"use client";

import { ContactFormOptimized } from "@/components/support/form";

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  className?: string;
}

export function ContactForm(props: ContactFormProps) {
  return <ContactFormOptimized {...props} />;
}

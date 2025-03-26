"use client";

import { ContactForm } from "@/components/support/form/ContactForm";
import { Card } from "@/components/ui/card";
import { SupportHeader } from "./SupportHeader";

export function SupportCard() {
  return (
    <Card className="border border-border shadow-md overflow-hidden">
      <SupportHeader />
      <div className="p-6">
        <ContactForm className="max-w-3xl mx-auto" />
      </div>
    </Card>
  );
}

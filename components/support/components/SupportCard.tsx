"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "../form";
import { SupportHeader } from "./SupportHeader";

export function SupportCard() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center space-y-2 pb-8">
        <SupportHeader />
      </CardHeader>
      <CardContent>
        <ContactForm />
      </CardContent>
    </Card>
  );
}

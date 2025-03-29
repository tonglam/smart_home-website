import { SupportContent } from "@/components/support/SupportContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support - Smart Home System",
  description:
    "Get help and support for your smart home system. Find answers to common questions and troubleshooting guides.",
  authors: [{ name: "Qitong Lan" }],
  openGraph: {
    title: "Support - Smart Home System",
    description: "Get help and support for your smart home system",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4">
        <SupportContent />
      </div>
    </div>
  );
}

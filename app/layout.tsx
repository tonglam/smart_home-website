import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { AuthNavigationProvider } from "@/components/auth/AuthNavigationContext";
import { Layout } from "@/components/layout/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Smart Home System",
  description: "Your connected home management platform",
  authors: [{ name: "Qitong Lan" }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon.svg" }],
  },
  other: {
    logo: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <AuthNavigationProvider>
            <AuthErrorBoundary>
              <TooltipProvider>
                <Layout>{children}</Layout>
                <Toaster
                  richColors
                  position="top-right"
                  closeButton
                  theme="dark"
                  duration={2000}
                />
              </TooltipProvider>
            </AuthErrorBoundary>
          </AuthNavigationProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

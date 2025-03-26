import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

// Metadata configuration
export const metadata: Metadata = {
  title: "Smart Home System",
  description: "Monitor and control your smart home devices",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: { url: "/logo.svg", type: "image/svg+xml" },
  },
};

// Auth provider component to wrap the application
const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider
    signInFallbackRedirectUrl="/"
    signInUrl="/signin"
    signUpUrl="/signup"
  >
    {children}
  </ClerkProvider>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </AuthProvider>
  );
}

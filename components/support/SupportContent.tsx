"use client";

import ConnectHomeDialog from "@/components/ConnectHomeDialog";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";

// SupportHeader component for the card header section
const SupportHeader = () => (
  <div className="p-6 bg-muted/50 border-b">
    <h2 className="text-2xl font-semibold text-center">Contact Us</h2>
    <p className="text-center text-muted-foreground mt-2">
      Fill out the form below and we&apos;ll get back to you shortly
    </p>
  </div>
);

// SupportCard component for the contact form card
const SupportCard = () => (
  <Card className="border border-border shadow-md overflow-hidden">
    <SupportHeader />
    <div className="p-6">
      <ContactForm className="max-w-3xl mx-auto" />
    </div>
  </Card>
);

// NavbarWrapper component to handle authentication logic
const NavbarWrapper = () => {
  const { user, isLoaded } = useUser();
  const { signOut, openSignIn } = useClerk();
  const isSignedIn = isLoaded && !!user;
  const isHomeConnected = isLoaded ? !!user?.publicMetadata?.homeId : false;
  const [showConnectHome, setShowConnectHome] = useState(false);

  return (
    <>
      <ConnectHomeDialog
        open={showConnectHome}
        onOpenChange={setShowConnectHome}
        onConnect={() => setShowConnectHome(false)}
      />

      <Navbar
        isSignedIn={isSignedIn}
        isHomeConnected={isHomeConnected}
        onSignIn={() => openSignIn()}
        onSignOut={() => signOut()}
        onOpenConnectHome={() => isSignedIn && setShowConnectHome(true)}
      />
    </>
  );
};

export const SupportContent = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <NavbarWrapper />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-4xl">
            <SupportCard />
          </div>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
};

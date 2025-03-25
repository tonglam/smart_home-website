'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, LogIn } from 'lucide-react';

interface HomeConnectionPromptProps {
  isSignedIn: boolean;
  onOpenConnectHome: () => void;
  onSignIn: () => void;
}

export function HomeConnectionPrompt({ isSignedIn, onOpenConnectHome, onSignIn }: HomeConnectionPromptProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Home className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Connect Your Smart Home</h2>
            {isSignedIn ? (
              <p className="text-muted-foreground">
                To access your smart home dashboard and control your devices, you'll need to connect your home first.
                This ensures secure access to all your smart home features.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Please sign in to your account before connecting your smart home.
                This security measure ensures that only authorized users can access your home devices.
              </p>
            )}
          </div>
          {isSignedIn ? (
            <Button 
              size="lg"
              className="w-full max-w-sm"
              onClick={onOpenConnectHome}
            >
              Connect Home Now
            </Button>
          ) : (
            <Button 
              size="lg"
              className="w-full max-w-sm"
              onClick={onSignIn}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Connect
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
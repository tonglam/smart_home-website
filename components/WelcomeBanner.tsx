'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function WelcomeBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // 5 seconds

    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Card className="relative">
      <div className="p-4 sm:p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold pr-8">Welcome to Your Smart Home</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-4">
          Monitor and control your smart home devices from one central dashboard.
          Quick access to all your connected devices and real-time monitoring.
        </p>
      </div>
    </Card>
  );
}
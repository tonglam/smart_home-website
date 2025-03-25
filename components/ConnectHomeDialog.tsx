'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { homeCache } from '@/lib/homeCache';
import { Label } from '@/components/ui/label';

interface ConnectHomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (homeId: string) => void;
}

export function ConnectHomeDialog({ open, onOpenChange, onConnect }: ConnectHomeDialogProps) {
  const [homeId, setHomeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!homeId.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cache the home ID
      if (homeCache.setHomeId(homeId)) {
        onConnect(homeId);
      }
    } catch (error) {
      console.error('Error connecting home:', error);
    }
    setIsLoading(false);
    setHomeId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Your Home</DialogTitle>
          <DialogDescription>
            Enter your home ID to connect and access all features. You can find your home ID in your account settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="homeId">Home ID</Label>
            <Input
              id="homeId"
              placeholder="Enter your home ID"
              value={homeId}
              onChange={(e) => setHomeId(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={!homeId.trim() || isLoading}>
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
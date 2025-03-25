'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, BellRing, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  onEmailChange: (newEmail: string) => void;
}

export function EmailChangeDialog({ 
  open, 
  onOpenChange, 
  currentEmail, 
  onEmailChange 
}: EmailChangeDialogProps) {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!newEmail) {
      setError('New email is required');
      return;
    }

    if (newEmail !== confirmEmail) {
      setError('Emails do not match');
      return;
    }

    if (newEmail === currentEmail) {
      setError('New email is the same as your current email');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for changing email
      await new Promise(resolve => setTimeout(resolve, 1000));
      onEmailChange(newEmail);
      toast.success('Email updated successfully', {
        description: 'A verification link has been sent to your new email address.'
      });
      onOpenChange(false);
      setNewEmail('');
      setConfirmEmail('');
    } catch (error) {
      setError('Failed to update email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setNewEmail('');
      setConfirmEmail('');
      setError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            Enter your new email address. You'll receive a verification link before the change is complete.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="bg-muted/50">
            <div className="flex items-start">
              <BellRing className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
              <AlertDescription className="text-muted-foreground text-sm">
                This email address will be used to receive important alerts and notifications from your smart home devices.
              </AlertDescription>
            </div>
          </Alert>
        
          <div className="space-y-2">
            <Label htmlFor="current-email">Current Email</Label>
            <Input 
              id="current-email" 
              value={currentEmail} 
              disabled 
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email</Label>
            <Input 
              id="new-email" 
              type="email" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-email">Confirm New Email</Label>
            <Input 
              id="confirm-email" 
              type="email" 
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Confirm new email address"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Email'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
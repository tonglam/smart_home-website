"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

interface ConnectHomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (homeId: string) => void;
}

export function ConnectHomeDialog({
  open,
  onOpenChange,
  onConnect,
}: ConnectHomeDialogProps) {
  const [homeId, setHomeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleConnect = async () => {
    if (!user?.id) {
      toast.error("Authentication required", {
        description: "Please sign in to connect your home.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to validate home ID
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onConnect(homeId);
    } catch (error) {
      console.error("Error connecting home:", error);
      toast.error("Failed to connect home", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="connect-home-description">
        <DialogHeader>
          <DialogTitle>Connect Your Smart Home</DialogTitle>
          <DialogDescription id="connect-home-description">
            Enter your home ID to connect and manage your smart home devices.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConnect();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeId">Home ID</Label>
              <Input
                id="homeId"
                placeholder="Enter your home ID"
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!homeId || isLoading}
            >
              {isLoading ? "Connecting..." : "Connect Home"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

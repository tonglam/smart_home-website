"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useHomeConnection } from "@/hooks";
import {
  ConnectButton,
  DialogHeaderContent,
  DisconnectButton,
  HomeIdInput,
} from "./components";

// Props for the ConnectionDialog component
interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (homeId: string) => void;
  currentHomeId?: string;
}

// Main ConnectionDialog component
export function ConnectionDialog({
  open,
  onOpenChange,
  onConnect,
  currentHomeId,
}: ConnectionDialogProps) {
  const { homeId, setHomeId, isConnecting, handleConnect, handleDisconnect } =
    useHomeConnection({
      open,
      onOpenChange,
      onConnect,
      currentHomeId,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConnect();
          }}
        >
          <DialogHeaderContent currentHomeId={currentHomeId} />
          <div className="py-6">
            <HomeIdInput
              homeId={homeId}
              setHomeId={setHomeId}
              isConnecting={isConnecting}
            />
          </div>
          <ConnectButton
            homeId={homeId}
            currentHomeId={currentHomeId}
            isConnecting={isConnecting}
          />
          {currentHomeId && (
            <DisconnectButton
              isConnecting={isConnecting}
              onClick={handleDisconnect}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

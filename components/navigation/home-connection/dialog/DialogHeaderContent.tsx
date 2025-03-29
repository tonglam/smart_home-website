import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogHeaderContentProps {
  currentHomeId?: string;
}

export function DialogHeaderContent({
  currentHomeId,
}: DialogHeaderContentProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {currentHomeId ? "Home Connection" : "Connect Your Home"}
      </DialogTitle>
      <DialogDescription>
        {currentHomeId
          ? "Manage your home connection or disconnect from this home"
          : "Enter your home ID to connect and manage your smart home devices"}
      </DialogDescription>
    </DialogHeader>
  );
}

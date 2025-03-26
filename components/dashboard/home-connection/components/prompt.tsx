import { Button } from "@/components/ui/button";
import { HiHome } from "react-icons/hi";

export const ConnectionIcon = () => (
  <HiHome className="h-12 w-12 text-muted-foreground mb-2" />
);

export const ConnectionTitle = () => (
  <h2 className="text-xl font-semibold">Connect Your Smart Home</h2>
);

export const ConnectionDescription = () => (
  <p className="text-sm text-muted-foreground max-w-md mx-auto">
    Connect your smart home to monitor and control your devices, view analytics,
    and set up automation.
  </p>
);

interface ConnectButtonProps {
  onClick: () => void;
}

export const ConnectButton = ({ onClick }: ConnectButtonProps) => (
  <div className="pt-4">
    <Button onClick={onClick}>Connect Home</Button>
  </div>
);

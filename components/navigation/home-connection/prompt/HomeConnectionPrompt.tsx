import { Card } from "@/components/ui/card";
import { HiHome } from "react-icons/hi";
import { PromptConnectButton } from "./PromptConnectButton";

interface HomeConnectionPromptProps {
  onOpenConnectHome: () => void;
}

export function HomeConnectionPrompt({
  onOpenConnectHome,
}: HomeConnectionPromptProps) {
  return (
    <Card className="p-6 text-center border-0">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <HiHome className="h-12 w-12 text-muted-foreground mb-2" />
        <h2 className="text-xl font-semibold">Connect Your Smart Home</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Connect your smart home to monitor and control your devices, view
          analytics, and set up automation.
        </p>
        <PromptConnectButton onClick={onOpenConnectHome} />
      </div>
    </Card>
  );
}

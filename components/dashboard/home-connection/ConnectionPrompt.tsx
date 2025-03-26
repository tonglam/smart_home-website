import { Card } from "@/components/ui/card";
import {
  ConnectButton,
  ConnectionDescription,
  ConnectionIcon,
  ConnectionTitle,
} from "./components/prompt";

interface ConnectionPromptProps {
  onOpenConnectHome: () => void;
}

export function ConnectionPrompt({ onOpenConnectHome }: ConnectionPromptProps) {
  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <ConnectionIcon />
        <ConnectionTitle />
        <ConnectionDescription />
        <ConnectButton onClick={onOpenConnectHome} />
      </div>
    </Card>
  );
}

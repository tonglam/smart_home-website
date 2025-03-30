import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaBell } from "react-icons/fa";

export function EmailNotificationAlert() {
  return (
    <Alert className="bg-muted/50">
      <div className="flex items-start">
        <FaBell
          className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground"
          aria-hidden="true"
        />
        <AlertDescription className="text-muted-foreground text-sm">
          This email address will be used to receive important alerts and
          notifications from your smart home devices.
        </AlertDescription>
      </div>
    </Alert>
  );
}

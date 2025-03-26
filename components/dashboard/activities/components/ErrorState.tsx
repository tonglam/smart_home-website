import { Button } from "@/components/ui/button";
import { HiExclamationCircle } from "react-icons/hi";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <HiExclamationCircle className="h-8 w-8 text-destructive mb-2" />
      <p className="text-sm font-medium">Failed to Load Activities</p>
      <p className="text-sm text-muted-foreground mb-4">
        There was an error loading your recent activities
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

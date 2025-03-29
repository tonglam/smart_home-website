"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Loader2 } from "lucide-react";

interface ActivityItemActionsProps {
  eventId: number;
  isRead: boolean;
  onMarkAsRead: (id: number) => void;
  isPending: boolean;
}

export function ActivityItemActions({
  eventId,
  isRead,
  onMarkAsRead,
  isPending,
}: ActivityItemActionsProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={() => onMarkAsRead(eventId)}
            disabled={isRead || isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span className="sr-only">Mark as Read</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs font-normal">
          {isRead ? "Already Read" : "Mark as Read"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

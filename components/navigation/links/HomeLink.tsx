"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoHomeOutline } from "react-icons/io5";

interface HomeLinkProps {
  isConnected: boolean;
  onClick: () => void;
}

export function HomeLink({ isConnected, onClick }: HomeLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onClick}
        >
          <IoHomeOutline className="h-5 w-5" />
          <span className="hidden sm:inline">
            {isConnected ? "Connected" : "Connect Home"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Connect your home to receive alerts and control your devices</p>
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-1">
            Your email will be used to receive important alerts
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

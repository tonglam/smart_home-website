"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoHomeOutline } from "react-icons/io5";

interface ConnectHomeButtonProps {
  isSignedIn: boolean;
  isHomeConnected: boolean;
  onClick: () => void;
}

export function ConnectHomeButton({
  isSignedIn,
  isHomeConnected,
  onClick,
}: ConnectHomeButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isSignedIn ? "outline" : "ghost"}
          size="sm"
          className="flex items-center gap-2"
          onClick={onClick}
          disabled={!isSignedIn}
        >
          <IoHomeOutline className="h-5 w-5" />
          <span className="hidden sm:inline">
            {isHomeConnected
              ? "Connected"
              : isSignedIn
              ? "Connect Home"
              : "Sign in to Connect"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {isSignedIn
            ? "Connect your home to receive alerts and control your devices"
            : "Sign in first to connect your smart home"}
        </p>
        {isSignedIn && !isHomeConnected && (
          <p className="text-xs text-muted-foreground mt-1">
            Your email will be used to receive important alerts
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

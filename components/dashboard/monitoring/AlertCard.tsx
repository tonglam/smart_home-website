"use client";

import { AlertDescription, Alert as AlertUI } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimeAgo } from "@/lib/utils/date.util";
import { cn } from "@/lib/utils/utils";
import type { Alert, AlertSeverity } from "@/types/dashboard.types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { HiBell, HiInformationCircle, HiXMark } from "react-icons/hi2";
import { AlertIconBadge } from "./AlertIconBadge";

const AlertColors: Record<AlertSeverity, string> = {
  warning:
    "border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:hover:bg-amber-950/50",
  info: "border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:hover:bg-blue-950/50",
  error:
    "border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:hover:bg-red-950/50",
};

interface AlertCardProps {
  alerts: Alert[];
  onDismiss: (alertId: string, deviceName: string) => Promise<void>;
}

export function AlertCard({ alerts, onDismiss }: AlertCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const alertCount = alerts.length;

  return (
    <div className="rounded-lg border border-border p-4 shadow-sm bg-background">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <HiBell className="h-4 w-4 text-muted-foreground" />
            System Alerts
            {alertCount > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {alertCount}
              </span>
            )}
          </h3>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 hover:bg-transparent hover:text-foreground"
            >
              <span className="text-xs text-muted-foreground">
                {isOpen ? "Hide" : "Show"}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  isOpen && "transform rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-3 mt-3 pt-3 border-t">
          {!alertCount ? (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <HiInformationCircle className="h-4 w-4" />
              <p>No critical alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertUI
                key={alert.id}
                variant="default"
                className={cn(
                  "relative border rounded-md shadow-sm transition-colors",
                  AlertColors[alert.type]
                )}
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3 p-1">
                  <AlertIconBadge type={alert.type} />

                  <AlertDescription className="flex-1 py-1">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground leading-tight">
                        {alert.message}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{alert.deviceName}</span>
                        <span aria-hidden="true">•</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <time
                                dateTime={alert.timestamp}
                                className="tabular-nums"
                              >
                                {formatTimeAgo(alert.timestamp).relative}
                              </time>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {formatTimeAgo(alert.timestamp).full}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </AlertDescription>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-md hover:bg-background/50 hover:text-foreground"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onDismiss(alert.id, alert.deviceName);
                    }}
                    aria-label={`Dismiss alert for ${alert.deviceName}`}
                    type="button"
                  >
                    <HiXMark className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </AlertUI>
            ))
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

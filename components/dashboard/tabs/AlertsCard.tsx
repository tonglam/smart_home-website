"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { Activity, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  HiExclamationCircle,
  HiInformationCircle,
  HiXMark,
} from "react-icons/hi2";
import { Alert as AlertType } from "./types";

export interface AlertsCardProps {
  alerts: AlertType[];
  onDismiss: (alertId: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const AlertIcon = {
  warning: HiExclamationCircle,
  info: HiInformationCircle,
  error: HiExclamationCircle,
};

const AlertColors = {
  warning: "border-border bg-muted hover:bg-muted/80 dark:border-muted",
  info: "border-border bg-background hover:bg-muted dark:border-muted",
  error:
    "border-destructive/20 bg-destructive/5 hover:bg-destructive/10 dark:border-destructive/30",
};

const formatTimeAgo = (
  timestamp: string
): { relative: string; full: string } => {
  try {
    const date = parseISO(timestamp);
    if (!isValid(date)) {
      return {
        relative: "Invalid date",
        full: "Invalid date",
      };
    }
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      full: format(date, "PPpp"),
    };
  } catch (error) {
    console.error(`Error formatting date: ${timestamp}`, error);
    return {
      relative: "Invalid date",
      full: "Invalid date",
    };
  }
};

export function AlertsCard({
  alerts,
  onDismiss,
  isLoading = false,
  error,
}: AlertsCardProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleDismiss = (alert: AlertType) => {
    onDismiss(alert.id);
    toast({
      title: "Alert Dismissed",
      description: `The alert for ${alert.deviceName} has been dismissed.`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-lg">Critical Alerts</h3>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-lg">Critical Alerts</h3>
          </div>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load alerts. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-l-4 border-l-orange-500">
        <div className="p-4 sm:p-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 mb-3 cursor-pointer group">
              <Activity className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-lg flex-1">
                Critical Alerts {alerts.length > 0 && `(${alerts.length})`}
              </h3>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  "group-hover:text-foreground",
                  isOpen && "transform rotate-180"
                )}
              />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4">
            {!alerts.length ? (
              <p className="text-sm text-muted-foreground">
                No critical alerts at this time
              </p>
            ) : (
              alerts.map((alert) => {
                const Icon = AlertIcon[alert.type];
                return (
                  <Alert
                    key={alert.id}
                    variant="default"
                    className={cn(
                      "relative border shadow-sm",
                      AlertColors[alert.type]
                    )}
                    role="alert"
                    aria-live="polite"
                  >
                    <Icon
                      className={cn("h-5 w-5 shrink-0")}
                      aria-hidden="true"
                    />
                    <AlertDescription className="flex-1 ml-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">
                          {alert.message}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{alert.deviceName}</span>
                          <span aria-hidden="true">•</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <time dateTime={alert.timestamp}>
                                  {formatTimeAgo(alert.timestamp).relative}
                                </time>
                              </TooltipTrigger>
                              <TooltipContent>
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
                      className={cn(
                        "absolute right-2 top-2 h-8 px-2 rounded-md",
                        "hover:bg-muted",
                        "flex items-center gap-1"
                      )}
                      onClick={() => handleDismiss(alert)}
                      aria-label={`Dismiss alert for ${alert.deviceName}`}
                    >
                      <span className="text-xs font-medium">Dismiss</span>
                      <HiXMark className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Alert>
                );
              })
            )}
          </CollapsibleContent>
        </div>
      </Card>
    </Collapsible>
  );
}

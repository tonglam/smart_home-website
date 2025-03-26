"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { Activity } from "lucide-react";
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
  warning: "text-yellow-500 dark:text-yellow-400",
  info: "text-blue-500 dark:text-blue-400",
  error: "text-red-500 dark:text-red-400",
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

  if (!alerts.length) {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-lg">Critical Alerts</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            No critical alerts at this time
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-orange-500">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-lg">
            Critical Alerts ({alerts.length})
          </h3>
        </div>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = AlertIcon[alert.type];
            return (
              <Alert
                key={alert.id}
                variant="default"
                className="relative"
                role="alert"
                aria-live="polite"
              >
                <Icon
                  className={cn("h-5 w-5 shrink-0", AlertColors[alert.type])}
                  aria-hidden="true"
                />
                <AlertDescription className="flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{alert.message}</span>
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
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-6 w-6 hover:bg-muted/50 rounded-full"
                  onClick={() => onDismiss(alert.id)}
                  aria-label={`Dismiss alert for ${alert.deviceName}`}
                >
                  <HiXMark className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Alert>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

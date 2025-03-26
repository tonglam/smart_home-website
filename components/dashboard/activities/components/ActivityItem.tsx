import { Activity } from "@/app/actions/activities";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  HiCheck,
  HiCog,
  HiExclamation,
  HiLightBulb,
  HiLockClosed,
  HiX,
  HiXCircle,
} from "react-icons/hi";

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "device":
      return <HiLightBulb className="h-5 w-5" />;
    case "security":
      return <HiLockClosed className="h-5 w-5" />;
    case "system":
      return <HiCog className="h-5 w-5" />;
    default:
      return <HiCog className="h-5 w-5" />;
  }
};

const getStatusIcon = (status: Activity["status"]) => {
  switch (status) {
    case "success":
      return <HiCheck className="h-4 w-4" />;
    case "warning":
      return <HiExclamation className="h-4 w-4" />;
    case "error":
      return <HiX className="h-4 w-4" />;
    default:
      return null;
  }
};

interface ActivityItemProps {
  activity: Activity;
  onRemove: (id: string) => void;
}

export function ActivityItem({ activity, onRemove }: ActivityItemProps) {
  return (
    <div className="group flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors relative">
      <div
        className={cn("p-2 rounded-full transition-colors", {
          "bg-blue-100 text-blue-600": activity.type === "device",
          "bg-red-100 text-red-600": activity.type === "security",
          "bg-purple-100 text-purple-600": activity.type === "system",
        })}
      >
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              {activity.target}
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full",
                  {
                    "bg-red-100 text-red-800": activity.status === "error",
                    "bg-yellow-100 text-yellow-800":
                      activity.status === "warning",
                    "bg-emerald-100 text-emerald-800":
                      activity.status === "success",
                  }
                )}
              >
                {getStatusIcon(activity.status)}
                {activity.status}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {activity.action}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {activity.relativeTime}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{activity.displayTime}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
              onClick={() => onRemove(activity.id)}
            >
              <HiXCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove activity</span>
            </Button>
          </div>
        </div>
        {activity.details && (
          <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 space-y-1">
            {activity.details.oldState && activity.details.newState && (
              <p>
                Changed from{" "}
                <span className="font-medium">{activity.details.oldState}</span>{" "}
                to{" "}
                <span className="font-medium">{activity.details.newState}</span>
              </p>
            )}
            {activity.details.message && <p>{activity.details.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

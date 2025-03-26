import { Activity } from "@/app/actions/activities";
import { cn } from "@/lib/utils";
import { HiClock } from "react-icons/hi";

export function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-0">
      <div className="p-2 bg-primary/10 rounded-full">
        <HiClock className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{activity.target}</p>
        <p className="text-sm text-muted-foreground">{activity.action}</p>
        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
        <span
          className={cn("inline-block px-2 py-0.5 text-xs rounded-full", {
            "bg-red-100 text-red-800": activity.status === "error",
            "bg-yellow-100 text-yellow-800": activity.status === "warning",
            "bg-blue-100 text-blue-800": activity.status === "success",
          })}
        >
          {activity.status}
        </span>
      </div>
    </div>
  );
}

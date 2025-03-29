import { cn } from "@/lib/utils/utils";
import type { Activity } from "@/types/dashboard.types";

interface ActivityItemDetailsProps {
  details: NonNullable<Activity["details"]>;
}

export function ActivityItemDetails({ details }: ActivityItemDetailsProps) {
  return (
    <div className="text-xs bg-muted/60 backdrop-blur-sm rounded-md p-3 space-y-2 border border-border/40 shadow-sm">
      {details.oldState && details.newState && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>Changed from</span>
          <span className="px-1.5 py-0.5 bg-muted rounded font-medium text-foreground/80">
            {details.oldState}
          </span>
          <span>to</span>
          <span className="px-1.5 py-0.5 bg-muted rounded font-medium text-foreground/80">
            {details.newState}
          </span>
        </div>
      )}

      {/* Display any other potential detail properties */}
      {Object.entries(details)
        .filter(([key]) => !["oldState", "newState"].includes(key))
        .map(([key, value], index) => (
          <div
            key={key}
            className={cn(
              "flex justify-between items-center",
              details.oldState &&
                details.newState &&
                index === 0 &&
                "mt-2 pt-2 border-t border-border/30"
            )}
          >
            <span className="capitalize text-muted-foreground">
              {key.replace(/([A-Z])/g, " $1").trim()}:
            </span>
            <span className="font-medium text-foreground/80 px-1.5 py-0.5 bg-muted rounded">
              {String(value)}
            </span>
          </div>
        ))}
    </div>
  );
}

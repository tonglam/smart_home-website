import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HiChevronDown, HiChevronUp, HiClock } from "react-icons/hi";

interface FeedHeaderProps {
  onToggleExpand: () => void;
  isExpanded: boolean;
  className?: string;
  activityCount?: number;
}

export function FeedHeader({
  onToggleExpand,
  isExpanded,
  className,
  activityCount = 0,
}: FeedHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b bg-card",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <HiClock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Recent Activities</h3>
          <p className="text-sm text-muted-foreground">
            {activityCount} {activityCount === 1 ? "activity" : "activities"}{" "}
            recorded
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpand}
        className="hover:bg-primary/10 hover:text-primary"
      >
        {isExpanded ? (
          <HiChevronUp className="h-4 w-4" />
        ) : (
          <HiChevronDown className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isExpanded ? "Collapse activities" : "Expand activities"}
        </span>
      </Button>
    </div>
  );
}

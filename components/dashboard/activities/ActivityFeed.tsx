"use client";

import { Activity, getRecentActivities } from "@/app/actions/activities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiClock,
  HiExclamationCircle,
} from "react-icons/hi";

// Activity item component
const ActivityItem = ({ activity }: { activity: Activity }) => (
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

// Feed header component
const FeedHeader = ({
  onToggleExpand,
  isExpanded,
  className,
}: {
  onToggleExpand: () => void;
  isExpanded: boolean;
  className?: string;
}) => (
  <div
    className={cn("flex items-center justify-between p-4 border-b", className)}
  >
    <h3 className="font-medium">Recent Device Activities</h3>
    <Button variant="ghost" size="sm" onClick={onToggleExpand}>
      {isExpanded ? (
        <HiChevronUp className="h-4 w-4" />
      ) : (
        <HiChevronDown className="h-4 w-4" />
      )}
    </Button>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <HiClock className="h-8 w-8 text-muted-foreground mb-2" />
    <p className="text-sm font-medium">No Recent Activities</p>
    <p className="text-sm text-muted-foreground">
      Activities will appear here when your devices are active
    </p>
  </div>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <HiExclamationCircle className="h-8 w-8 text-destructive mb-2" />
    <p className="text-sm font-medium">Failed to Load Activities</p>
    <p className="text-sm text-muted-foreground mb-4">
      There was an error loading your recent activities
    </p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Try Again
    </Button>
  </div>
);

interface DeviceActivityFeedProps {
  className?: string;
}

export function DeviceActivityFeed({ className }: DeviceActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = (await getRecentActivities()) as Activity[];
      setActivities(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch activities")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (isLoading) {
    return <Card className={cn("animate-pulse h-48", className)} />;
  }

  if (error) {
    return (
      <Card className={className}>
        <ErrorState onRetry={fetchActivities} />
      </Card>
    );
  }

  if (!activities.length) {
    return (
      <Card className={className}>
        <EmptyState />
      </Card>
    );
  }

  return (
    <Card className={className}>
      <FeedHeader
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />
      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          <div className="divide-y">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

"use client";

import { Activity, getRecentActivities } from "@/app/actions/activities";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { ActivityItem } from "./components/ActivityItem";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { FeedHeader } from "./components/FeedHeader";

interface DeviceActivityFeedProps {
  className?: string;
  homeId: string;
}

export function DeviceActivityFeed({
  className,
  homeId,
}: DeviceActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = (await getRecentActivities(homeId)) as Activity[];
      setActivities(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch activities")
      );
    } finally {
      setIsLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleRemoveActivity = useCallback((id: string) => {
    setActivities((current) =>
      current.filter((activity) => activity.id !== id)
    );
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
        activityCount={activities.length}
      />
      <Collapsible open={isExpanded}>
        <CollapsibleContent className="divide-y">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onRemove={handleRemoveActivity}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

"use client";

import { Activity, getRecentActivities } from "@/app/actions/activities";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import type { DashboardData } from "../MainDashboard";
import { ActivityItem } from "./components/ActivityItem";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { FeedHeader } from "./components/FeedHeader";

interface DeviceActivityFeedProps {
  className?: string;
  homeId: string;
  initialEvents?: DashboardData["events"];
}

export function DeviceActivityFeed({
  className,
  homeId,
  initialEvents = [],
}: DeviceActivityFeedProps) {
  const transformEvent = (event: DashboardData["events"][0]): Activity => ({
    id: String(event.id),
    type: "device",
    action: event.event_type,
    target: event.device_id || "unknown",
    timestamp: event.created_at,
    displayTime: new Date(event.created_at).toLocaleString(),
    relativeTime: new Date(event.created_at).toLocaleString(),
    status: "success",
    details: {
      oldState: event.old_state,
      newState: event.new_state,
    },
  });

  const [activities, setActivities] = useState<Activity[]>(
    initialEvents.map(transformEvent)
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(initialEvents.length === 0);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(Date.now());

  const fetchActivities = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetched < 30000 && activities.length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = (await getRecentActivities(homeId)) as Activity[];
      setActivities(data);
      setLastFetched(now);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch activities")
      );
    } finally {
      setIsLoading(false);
    }
  }, [homeId, lastFetched, activities.length]);

  useEffect(() => {
    if (initialEvents.length === 0 || Date.now() - lastFetched > 60000) {
      fetchActivities();
    }

    const intervalId = setInterval(fetchActivities, 60000);
    return () => clearInterval(intervalId);
  }, [fetchActivities, initialEvents.length, lastFetched]);

  const handleRemoveActivity = useCallback((id: string) => {
    setActivities((current) =>
      current.filter((activity) => activity.id !== id)
    );
  }, []);

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-2">
              <Skeleton className="h-16 w-full mb-2" />
            </div>
          ))}
        </div>
      </Card>
    );
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

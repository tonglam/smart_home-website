"use client";

import { markEventReadAction } from "@/app/actions/dashboard/activity.action";
import { ActivityItem } from "@/components/dashboard/activity/ActivityItem";
import { FeedHeader } from "@/components/dashboard/activity/FeedHeader";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Activity } from "@/types/dashboard.types";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({
  activities: initialActivities,
}: ActivityFeedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const [pendingActivityIds, setPendingActivityIds] = useState<Set<number>>(
    new Set()
  );
  const [localActivities, setLocalActivities] =
    useState<Activity[]>(initialActivities);

  useEffect(() => {
    setPendingActivityIds(new Set());
    setLocalActivities(initialActivities);
  }, [initialActivities]);

  const handleMarkAsRead = useCallback(
    async (id: number) => {
      if (pendingActivityIds.has(id)) return;

      const originalActivities = [...localActivities];
      const activityToMark = localActivities.find((act) => act.id === id);

      if (!activityToMark || activityToMark.read) {
        return;
      }

      setPendingActivityIds((prev) => new Set(prev).add(id));

      setLocalActivities((current) =>
        current.map((act) => (act.id === id ? { ...act, read: true } : act))
      );

      try {
        const result = await markEventReadAction(id, pathname);

        if (!result.success) {
          throw new Error(result.error || "Server action failed");
        }

        toast.success("Activity marked as read.");
      } catch (error) {
        console.error("Failed to mark event as read:", error);
        setLocalActivities(originalActivities);
        toast.error("Failed to mark activity as read. Please try again.");
      } finally {
        setPendingActivityIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [localActivities, pathname, pendingActivityIds]
  );

  return (
    <Card>
      <FeedHeader
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        activityCount={localActivities.filter((a) => !a.read).length}
      />
      <Collapsible open={isExpanded}>
        <CollapsibleContent className="divide-y">
          {localActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onMarkAsRead={handleMarkAsRead}
              isPending={pendingActivityIds.has(activity.id)}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

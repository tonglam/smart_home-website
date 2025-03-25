"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { recentActivities } from "@/lib/data";
import { useState } from "react";
import { HiChevronDown, HiChevronUp, HiClock } from "react-icons/hi";

export function ActivitiesFeed() {
  const [isActivitiesOpen, setActivitiesOpen] = useState(true);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiClock className="h-5 w-5" />
          <h3 className="font-semibold">Recent Activities</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setActivitiesOpen(!isActivitiesOpen)}
        >
          {isActivitiesOpen ? (
            <HiChevronUp className="h-4 w-4" />
          ) : (
            <HiChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={`transition-all duration-300 ${
          isActivitiesOpen ? "max-h-[500px]" : "max-h-0"
        } overflow-hidden`}
      >
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
              <span>{activity.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

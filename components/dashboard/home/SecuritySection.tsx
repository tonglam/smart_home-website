"use client";

import { getSecurityPoints, type SecurityPoint } from "@/app/actions/security";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { HiDesktopComputer, HiKey, HiShieldCheck } from "react-icons/hi";

export function SecuritySection() {
  const { user } = useUser();
  const [securityPoints, setSecurityPoints] = useState<SecurityPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setIsLoading(true);
        const homeId = user?.publicMetadata?.homeId as string;
        if (!homeId) {
          console.error("No homeId found in user metadata");
          return;
        }
        const data = await getSecurityPoints(homeId);
        setSecurityPoints(data);
      } catch (error) {
        console.error("Error fetching security data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSecurityData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6 order-3">
        <div className="flex items-center gap-2 mb-4">
          <HiShieldCheck className="h-5 w-5" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 order-3">
      <div className="flex items-center gap-2 mb-4">
        <HiShieldCheck className="h-5 w-5" />
        <h3 className="font-semibold">Security</h3>
      </div>
      <div className="space-y-3">
        {securityPoints.map((point) => (
          <div
            key={point.id}
            className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {point.type === "door" ? (
                <HiKey className="h-4 w-4" />
              ) : (
                <HiDesktopComputer className="h-4 w-4" />
              )}
              <span className="text-sm">{point.name}</span>
            </div>
            <Badge
              variant={point.status === "closed" ? "default" : "destructive"}
            >
              {point.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

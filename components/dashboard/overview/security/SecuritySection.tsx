// "use client"; // No longer needs to be a client component at this level if all state is lifted

import { SecurityItem } from "@/components/dashboard/overview/security/SecurityItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SecurityPoint } from "@/types/dashboard.types";
import { Shield } from "lucide-react";

interface SecuritySectionProps {
  securityPoints: SecurityPoint[];
}

export function SecuritySection({ securityPoints }: SecuritySectionProps) {
  if (!securityPoints?.length) {
    return (
      <Card className="p-4 sm:p-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Shield className="h-5 w-5" />
            Security Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No security points to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Shield className="h-5 w-5" />
          Security Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {securityPoints.map((point) => (
          <SecurityItem key={point.id} point={point} />
        ))}
      </CardContent>
    </Card>
  );
}

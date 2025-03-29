import { AlertCardContainer } from "@/components/dashboard/monitoring/AlertCardContainer";
import { CameraFeed } from "@/components/dashboard/monitoring/CameraFeed";
import type { Alert } from "@/types/dashboard.types";

interface MonitoringTabProps {
  alerts: Alert[];
}

export function MonitoringTab({ alerts }: MonitoringTabProps) {
  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <AlertCardContainer alerts={alerts} />

      {/* Camera Section */}
      <CameraFeed />
    </div>
  );
}

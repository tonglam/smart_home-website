import { AlertCardContainer } from "@/components/dashboard/monitoring/AlertCardContainer";
import { CameraFeed } from "@/components/dashboard/monitoring/CameraFeed";
import { RecordingReview } from "@/components/dashboard/monitoring/RecordingReview";
import type { Alert } from "@/types/dashboard.types";

interface MonitoringTabProps {
  homeId: string;
  alerts: Alert[];
}

export function MonitoringTab({ homeId, alerts }: MonitoringTabProps) {
  const videoUrl =
    "https://pub-eb511340529f448cbad68bb2667a12aa.r2.dev/recording.mp4";

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <AlertCardContainer alerts={alerts} />

      {/* Camera Section */}
      <CameraFeed homeId={homeId} />

      {/* Video Recording Review */}
      <RecordingReview videoUrl={videoUrl} />
    </div>
  );
}

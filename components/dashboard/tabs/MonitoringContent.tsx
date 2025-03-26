"use client";

import { useState } from "react";
import { AlertsCard } from "./AlertsCard";
import { CameraFeed } from "./CameraFeed";

export const MonitoringContent = () => {
  const [showAlerts, setShowAlerts] = useState(true);

  return (
    <div className="space-y-6">
      {/* Critical Alerts Section */}
      {showAlerts && <AlertsCard onClose={() => setShowAlerts(false)} />}

      {/* Camera Feeds Section */}
      <CameraFeed />
    </div>
  );
};

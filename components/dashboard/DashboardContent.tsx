import { MonitoringContent } from "./tabs/MonitoringContent";

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight" id="dashboard-title">
          Dashboard
        </h1>
      </div>
      <MonitoringContent />
    </div>
  );
}

import { HiClock } from "react-icons/hi";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <HiClock className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm font-medium">No Recent Activities</p>
      <p className="text-sm text-muted-foreground">
        Activities will appear here when your devices are active
      </p>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import type { SecurityPoint } from "@/types";
import { MdDeviceHub, MdDoorFront, MdSensors, MdWindow } from "react-icons/md";

interface SecurityItemProps {
  point: SecurityPoint;
}

export function SecurityItem({ point }: SecurityItemProps) {
  const IconComponent = {
    door: MdDoorFront,
    window: MdWindow,
    motion: MdSensors,
    device: MdDeviceHub,
  }[point.type];

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <IconComponent className="h-4 w-4" />
        <span className="text-sm font-medium">{point.name}</span>
      </div>
      <Badge
        variant={point.status === "closed" ? "default" : "destructive"}
        className="capitalize"
      >
        {point.status}
      </Badge>
    </div>
  );
}

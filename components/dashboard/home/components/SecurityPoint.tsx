"use client";

import { Badge } from "@/components/ui/badge";
import { DoorOpen as Door, AppWindow as Window } from "lucide-react";

interface SecurityPointProps {
  id: string;
  name: string;
  type: string;
  status: string;
  lastActivity?: string;
}

export function SecurityPoint({ name, type, status }: SecurityPointProps) {
  const isDoor = type.toLowerCase() === "door";
  const isClosed = status.toLowerCase() === "closed";

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        {isDoor ? <Door className="h-4 w-4" /> : <Window className="h-4 w-4" />}
        <span className="text-sm">{name}</span>
      </div>
      <Badge variant={isClosed ? "default" : "destructive"}>{status}</Badge>
    </div>
  );
}

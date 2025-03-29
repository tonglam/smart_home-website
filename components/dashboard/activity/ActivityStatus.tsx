import { cn } from "@/lib/utils/utils";
import type { Activity } from "@/types/dashboard.types";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

interface ActivityStatusProps {
  status: Activity["status"];
}

export function ActivityStatus({ status }: ActivityStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <HiCheck className="h-3.5 w-3.5" />;
      case "warning":
        return <HiExclamation className="h-3.5 w-3.5" />;
      case "error":
        return <HiX className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 text-[0.65rem] font-medium rounded-full leading-none tracking-wide capitalize",
        {
          "bg-red-100/80 text-red-700 ring-1 ring-red-200/50":
            status === "error",
          "bg-amber-100/80 text-amber-700 ring-1 ring-amber-200/50":
            status === "warning",
          "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200/50":
            status === "success",
        }
      )}
    >
      {getStatusIcon()}
      {status}
    </span>
  );
}

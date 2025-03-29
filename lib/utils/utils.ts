import { Activity } from "@/types/dashboard.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getActivityMessage = (activity: Activity): string => {
  if (activity.details?.oldState && activity.details.newState) {
    return `Changed from ${activity.details.oldState} to ${activity.details.newState}`;
  }
  return `${activity.action} on ${activity.target}`;
};

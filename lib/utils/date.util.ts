/**
 * Date formatting and manipulation utilities for consistent time display across the app
 */

/**
 * Converts a date to a human-readable relative time string (e.g., "2 hours ago")
 * Falls back to full date format for older dates
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - targetDate.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return formatDateTime(targetDate);
}

export function formatDateTime(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(targetDate);
}

export function formatDateTimeWithDay(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(targetDate);
}

export function formatDateTimeFull(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(targetDate);
}

export function formatTimeAgo(timestamp: string): {
  relative: string;
  full: string;
} {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return { relative: "Invalid date", full: "Invalid date" };
    }
    return {
      relative: formatRelativeTime(date),
      full: formatDateTimeFull(date),
    };
  } catch (error) {
    console.error(`Error formatting date: ${timestamp}`, error);
    return { relative: "Invalid date", full: "Invalid date" };
  }
}

/**
 * Returns a localized greeting based on the current time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

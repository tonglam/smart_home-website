/**
 * Format a date to relative time (e.g., "2 hours ago", "just now")
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

  // For older dates, show the full format
  return formatDateTime(targetDate);
}

/**
 * Format a date to human readable format (e.g., "Mar 26, 3:12 PM")
 */
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

/**
 * Format a date to include weekday (e.g., "Tuesday, Mar 26, 3:12 PM")
 */
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

/**
 * Format a date to full format (e.g., "Tuesday, March 26, 2025 at 3:12 PM")
 */
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

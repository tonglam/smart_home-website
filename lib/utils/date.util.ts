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

/**
 * Format a date to relative and full format
 * @returns Object containing relative time (e.g., "2 hours ago") and full datetime
 */
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
 * Get a time-appropriate greeting based on the current hour
 * @returns "Good morning" (12am-11:59am), "Good afternoon" (12pm-5:59pm), or "Good evening" (6pm-11:59pm)
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

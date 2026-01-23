// Convert ISO string to 'YYYY-MM-DDTHH:mm' for datetime-local input
export function toInputDateTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
export function formatTime(value?: string | null, locale = "en-US"): string {
  if (!value) return "-";

  // Handle either full datetime strings or plain time strings like "18:00:00"
  let date = new Date(value);

  if (isNaN(date.getTime())) {
    const timeMatch = /^([0-2]?\d):([0-5]\d)(?::([0-5]\d))?$/.exec(
      value.trim(),
    );
    if (!timeMatch) return "-";

    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const seconds = Number(timeMatch[3] ?? 0);

    // Use a fixed date to avoid timezone surprises when formatting
    date = new Date(1970, 0, 1, hours, minutes, seconds);
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

// Extract HH:MM from an ISO datetime or plain time string for form inputs
export function toInputTime(value?: string | null): string {
  if (!value) return "";

  // Try parsing as Date to handle ISO strings
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    const hours = parsed.getUTCHours().toString().padStart(2, "0");
    const minutes = parsed.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const match = /T?(\d{1,2}:\d{2})(?::\d{2})?/.exec(value);
  if (!match) return "";
  const [h, m] = match[1].split(":");
  return `${h.padStart(2, "0")}:${m}`;
}

// Extract YYYY-MM-DD from an ISO datetime string
export function extractDatePart(value?: string | null): string | null {
  if (!value) return null;
  const match = /(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : null;
}

// Build an ISO datetime string in UTC from a date (YYYY-MM-DD) and time (HH:MM or HH:MM:SS)
export function buildUtcDateTime(datePart: string, time: string): string {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const iso = `${datePart}T${normalizedTime}Z`;
  const date = new Date(iso);
  return isNaN(date.getTime()) ? iso : date.toISOString();
}

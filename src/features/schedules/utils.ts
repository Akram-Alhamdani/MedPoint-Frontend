export function formatTime(value?: string | null, locale = "en-US"): string {
  if (!value) return "-";

  // Handle either full datetime strings or plain time strings like "18:00:00"
  let date = new Date(value);

  if (isNaN(date.getTime())) {
    const timeMatch = /^([0-2]?\d):([0-5]\d)(?::([0-5]\d))?$/.exec(
      value.trim()
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
  }).format(date);
}

// Formats a date+time string to 'YYYY-MM-DD, HH:MM AM/PM' (localized)
export function formatDateTime(
  value?: string | null,
  locale = "en-US",
): string {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  // Format date part
  const datePart = date.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // Format time part
  const timePart = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return `${datePart} ${timePart}`;
}

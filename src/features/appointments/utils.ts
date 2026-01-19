export function calculateAge(dob?: string | null): string {
  if (!dob) return "-";

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return "-";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "-";
}

// utils/date.ts
export function formatDateTime(
  value?: string | null,
  locale = "en-US"
): string {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

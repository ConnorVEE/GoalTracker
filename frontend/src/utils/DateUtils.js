export function formatRelativeDate(date) {
  const today = new Date();
  const tomorrow = new Date();
  const yesterday = new Date();

  tomorrow.setDate(today.getDate() + 1);
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Change these dates to return that actual tomorrow and yesterday dates
  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";
  if (isYesterday) return "Yesterday";

  // if not today/tomorrow/yesterday, include year only if different
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  if (date.getFullYear() !== today.getFullYear()) {
    options.year = "numeric";
  }

  return date.toLocaleDateString(undefined, options);
}

export function getLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
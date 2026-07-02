const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDay(date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Returns { start, end } for a preset key */
export function getDateRangeBounds(range) {
  const now = new Date();
  const end = endOfDay(now);
  const start = startOfDay(now);

  if (range === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
  } else if (range === "7days") {
    start.setDate(start.getDate() - 6);
  } else if (range === "30days") {
    start.setDate(start.getDate() - 29);
  }

  return { start, end };
}

/** Pill label e.g. "May 13 – Jun 11, 2026" or "Jun 11, 2026" for single day */
export function formatDateRangeLabel(range) {
  const { start, end } = getDateRangeBounds(range);
  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${formatDay(start)}, ${start.getFullYear()}`;
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  if (sameYear) {
    return `${formatDay(start)} – ${formatDay(end)}, ${end.getFullYear()}`;
  }

  return `${formatDay(start)}, ${start.getFullYear()} – ${formatDay(end)}, ${end.getFullYear()}`;
}

export const DATE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7days", label: "7 Days" },
  { key: "30days", label: "30 Days" },
];

function getWeekdayIndexInTimeZone(date: Date, timeZone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone,
  }).format(date);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return map[weekday];
}

export function getWeekdayIndexForTimeZone(date: Date, timeZone: string) {
  return getWeekdayIndexInTimeZone(date, timeZone);
}

export function getIsoDateInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function hasWeekStarted(weekStart: string, timeZone: string, from = new Date()) {
  return getIsoDateInTimeZone(from, timeZone) >= weekStart;
}

export function getDayNumberInWeek(weekStart: string, timeZone: string, from = new Date()) {
  const today = new Date(`${getIsoDateInTimeZone(from, timeZone)}T12:00:00Z`);
  const start = new Date(`${weekStart}T12:00:00Z`);
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  return Math.min(7, Math.max(1, diffDays + 1));
}

export function getUpcomingWeekWindow(timeZone: string, from = new Date()) {
  const weekday = getWeekdayIndexInTimeZone(from, timeZone);
  const daysUntilNextMonday = weekday === 1 ? 7 : (8 - weekday) % 7;
  const monday = new Date(from);
  monday.setUTCDate(monday.getUTCDate() + daysUntilNextMonday);

  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);

  return {
    weekStart: getIsoDateInTimeZone(monday, timeZone),
    weekEnd: getIsoDateInTimeZone(sunday, timeZone),
  };
}

export function getTimezoneBandLabel(timeZone: string) {
  const now = new Date();
  const utcHour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(now)
  );

  const zoneHour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone,
    }).format(now)
  );

  let offset = zoneHour - utcHour;
  if (offset > 12) offset -= 24;
  if (offset < -12) offset += 24;

  const start = Math.floor(offset / 3) * 3;
  const end = start + 2;
  const format = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

  return `UTC${format(start)} to UTC${format(end)}`;
}

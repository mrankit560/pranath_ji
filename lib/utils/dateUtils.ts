export const monthsEn = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const monthsHi = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
];

export const daysEn = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export const daysHi = [
  "रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"
];

export interface ParsedDateInfo {
  year: number;
  month: number; // 0-indexed
  day: number;
  dayOfWeek: number;
  hour?: number;
  minute?: number;
}

export function parseDateSafe(dateInput?: string | Date | null): ParsedDateInfo | null {
  if (!dateInput) return null;
  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim();
    // Match YYYY-MM-DD or YYYY-MM-DDTHH:mm...
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const hour = match[4] ? parseInt(match[4], 10) : 12;
      const minute = match[5] ? parseInt(match[5], 10) : 0;
      // Anchor at midday local time to avoid timezone boundary shifts
      const anchor = new Date(year, month, day, 12, 0, 0);
      return {
        year,
        month,
        day,
        dayOfWeek: anchor.getDay(),
        hour,
        minute,
      };
    }
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    dayOfWeek: d.getDay(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

export function formatEventDateRangeSafe(
  startStr?: string | Date | null,
  endStr?: string | Date | null,
  isEn: boolean = false
): string {
  const start = parseDateSafe(startStr);
  if (!start) return "";

  const end = parseDateSafe(endStr);
  const months = isEn ? monthsEn : monthsHi;
  const days = isEn ? daysEn : daysHi;

  const isSameDay =
    end &&
    end.year === start.year &&
    end.month === start.month &&
    end.day === start.day;

  const hasDistinctEnd = end && !isSameDay;

  if (hasDistinctEnd) {
    return `${start.day} ${months[start.month]} ${start.year} (${days[start.dayOfWeek]}) – ${end.day} ${months[end.month]} ${end.year} (${days[end.dayOfWeek]})`;
  }

  return `${start.day} ${months[start.month]} ${start.year} (${days[start.dayOfWeek]})`;
}

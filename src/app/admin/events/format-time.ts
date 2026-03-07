import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

/**
 * Parse a formatted event time string back to HH:mm (24h) for the TimePicker.
 * Extracts the CT time from formats like "Fri 10AM (CT) - 11AM (ET) - 12PM Venezuela"
 * or plain "HH:mm" formats.
 */
export function parseEventTime(timeStr: string): string {
  if (!timeStr) return "";

  // Already in HH:mm format
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr;

  // Extract CT time from formatted string: "Fri 10AM (CT)" or "Fri 10:30PM (CT)"
  const match = timeStr.match(/\w+\s+(\d{1,2})(?::(\d{2}))?(AM|PM)\s*\(CT\)/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3].toUpperCase();
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  return "";
}

function formatHour(date: TZDate): string {
  const h = format(date, "h");
  const m = format(date, "mm");
  const period = format(date, "a").toUpperCase();
  const minutePart = m !== "00" ? `:${m}` : "";
  return `${h}${minutePart}${period}`;
}

/**
 * Formats a date + time (in Houston/CT) into a multi-timezone string.
 * Example: "Fri 10AM (CT) - 11AM (ET) - 12PM Venezuela"
 *
 * @param dateStr - Date in "yyyy-MM-dd" format
 * @param timeStr - Time in "HH:mm" 24h format (Houston/Central Time)
 */
export function formatEventTime(dateStr: string, timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const [year, month, day] = dateStr.split("-").map(Number);

  // Create date in Central Time (Houston) — TZDate handles DST automatically
  const ctDate = new TZDate(year, month - 1, day, hours, minutes, 0, 0, "America/Chicago");

  // Convert to other timezones by creating TZDate from the same instant
  const etDate = new TZDate(ctDate.getTime(), "America/New_York");
  const vzDate = new TZDate(ctDate.getTime(), "America/Caracas");

  const dayName = format(ctDate, "EEE");
  const ct = formatHour(ctDate);
  const et = formatHour(etDate);
  const vz = formatHour(vzDate);

  return `${dayName} ${ct} (CT) - ${et} (ET) - ${vz} Venezuela`;
}

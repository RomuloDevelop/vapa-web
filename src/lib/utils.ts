import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a date-only string (yyyy-MM-dd) as local time.
 * Prevents the off-by-one-day bug caused by JS interpreting
 * "2026-03-06" as UTC midnight (which shifts to the previous day
 * in timezones behind UTC like CT).
 */
export function parseLocalDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

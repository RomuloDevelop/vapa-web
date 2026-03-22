// Utility functions for Digital Library

import { parseLocalDate } from "@/lib/utils";

// Format date from ISO string to readable format
export function formatDate(dateString: string, locale: string = "en"): string {
  return parseLocalDate(dateString).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );
}

// Get year from ISO date string
export function getYear(dateString: string): string {
  return parseLocalDate(dateString).getFullYear().toString();
}

// Get video URL (first link that looks like a video)
export function getVideoUrl(links: string[]): string | undefined {
  return links.find(
    (link) =>
      link.includes("youtube.com") ||
      link.includes("youtu.be") ||
      (link !== "#" && link !== "#.")
  );
}

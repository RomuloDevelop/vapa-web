// Utility functions for Digital Library

// Format date from ISO string to readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Get year from ISO date string
export function getYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
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

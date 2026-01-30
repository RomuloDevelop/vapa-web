export type { LibraryEvent } from "./types";
export { events2020 } from "./2020";
export { events2021 } from "./2021";
export { events2022 } from "./2022";
export { events2023 } from "./2023";
export { events2024 } from "./2024";
export { events2025 } from "./2025";
export { events2026 } from "./2026";
export { eventImages, getImage } from "./images";

// Combine all events (newest first)
import { events2020 } from "./2020";
import { events2021 } from "./2021";
import { events2022 } from "./2022";
import { events2023 } from "./2023";
import { events2024 } from "./2024";
import { events2025 } from "./2025";
import { events2026 } from "./2026";

export const allEvents = [
  ...events2026,
  ...events2025,
  ...events2024,
  ...events2023,
  ...events2022,
  ...events2021,
  ...events2020,
];

// Get unique years from all events
export const filterYears = [
  "All",
  ...Array.from(
    new Set(allEvents.map((e) => new Date(e.date).getFullYear().toString()))
  ).sort((a, b) => Number(b) - Number(a)),
];

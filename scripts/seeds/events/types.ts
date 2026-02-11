import type { EventType } from "@/lib/database.types";

export interface LibraryEvent {
  name: string;
  img: string;
  date: string; // ISO date string (YYYY-MM-DD)
  type: EventType;
  time: string;
  presenters: string[];
  links: string[];
}

"use server";

import { createServerClient } from "../supabase-server";
import { getEvents, getEventsCount, revalidateEventPaths } from "../services/events";
import { adminAction, ActionError } from "./safe-action";
import type { Event, EventInsert, EventType } from "../database.types";
import {
  IMAGE_TYPES,
  eventInputSchema,
  eventSchema,
  extractEvent,
  loadImage,
  translateEvent,
  type CreateEventInput,
} from "../services/event-input";
import { formatEventTime } from "@/app/[locale]/admin/events/format-time";

const PAGE_SIZE = 10;

export interface EventsFilterParams {
  year?: number;
  type?: EventType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

export interface FilteredEventsResult {
  events: Event[];
  totalCount: number;
}

export const fetchFilteredEvents = adminAction(
  async (params: EventsFilterParams): Promise<FilteredEventsResult> => {
    const { year, type, dateFrom, dateTo, page = 1 } = params;
    const offset = (page - 1) * PAGE_SIZE;

    const filters = { year, type, dateFrom, dateTo, limit: PAGE_SIZE, offset };
    const countFilters = { year, type, dateFrom, dateTo };

    const [events, totalCount] = await Promise.all([
      getEvents(filters),
      getEventsCount(countFilters),
    ]);

    return { events, totalCount };
  }
);

function parseArrayField(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Not exported: in a "use server" file only exported functions become callable endpoints.
async function insertEvent(row: EventInsert): Promise<{ id: string }> {
  const { data, error } = await createServerClient().from("events").insert(row).select("id").single();
  if (error) {
    throw new ActionError("SERVER_ERROR", error.message);
  }
  revalidateEventPaths();
  return { id: data.id };
}

/**
 * Create a new event (admin-only)
 */
export const createEvent = adminAction(
  async (formData: FormData): Promise<{ id: string }> => {
    return insertEvent({
      name: formData.get("name") as string,
      name_en: (formData.get("name_en") as string) || null,
      img: formData.get("img") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as EventType,
      time: formData.get("time") as string,
      presenters: parseArrayField((formData.get("presenters") as string) || ""),
      links: parseArrayField((formData.get("links") as string) || ""),
      description: (formData.get("description") as string) || null,
      description_en: (formData.get("description_en") as string) || null,
    });
  }
);

/**
 * Create an event from an image (Gemini reads it), partial event fields, or both (admin-only).
 * Missing Spanish/English texts are translated. `dry_run` returns the event without saving it.
 */
export const createEventFromInput = adminAction(
  async (input: CreateEventInput): Promise<{ id: string | null; event: EventInsert }> => {
    const parsedInput = eventInputSchema.safeParse(input);
    if (!parsedInput.success) throw new ActionError("VALIDATION", parsedInput.error.message);
    const { image, event = {}, dry_run } = parsedInput.data;
    if (!image && !Object.keys(event).length) {
      throw new ActionError("VALIDATION", "Provide `image`, `event`, or both");
    }

    const loaded = image ? await loadImage(image) : null;
    const extracted = loaded ? await extractEvent(loaded) : {};
    const merged = await translateEvent({ ...extracted, ...event });
    const parsed = eventSchema.safeParse(merged);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new ActionError("VALIDATION", `Incomplete event (${issues}). Read so far: ${JSON.stringify(merged)}`);
    }
    const { img, ...fields } = parsed.data;
    // the event picture is `event.img` if given, otherwise the image itself (uploaded below)
    const picture = img ?? loaded;
    if (!picture) throw new ActionError("VALIDATION", "Missing event picture: pass `image` or `event.img`");
    const row = { ...fields, time: formatEventTime(fields.date, fields.time) };

    if (dry_run) return { id: null, event: { ...row, img: img ?? "(the given image, uploaded on save)" } };

    const supabase = createServerClient();
    let uploadedPath: string | null = null;
    let imgUrl: string;
    if (typeof picture === "string") {
      imgUrl = picture;
    } else {
      uploadedPath = `${Date.now()}-${crypto.randomUUID()}.${IMAGE_TYPES[picture.type]}`;
      const { error } = await supabase.storage
        .from("event-images")
        .upload(uploadedPath, picture.bytes, { contentType: picture.type, upsert: false });
      if (error) throw new ActionError("SERVER_ERROR", `Image upload failed: ${error.message}`);
      imgUrl = supabase.storage.from("event-images").getPublicUrl(uploadedPath).data.publicUrl;
    }

    const saved = { ...row, img: imgUrl };
    try {
      const { id } = await insertEvent(saved);
      return { id, event: saved };
    } catch (error) {
      if (uploadedPath) await supabase.storage.from("event-images").remove([uploadedPath]);
      throw error;
    }
  }
);

/**
 * Update an existing event (admin-only)
 */
export const updateEvent = adminAction(
  async (id: string, formData: FormData) => {
    const supabase = createServerClient();

    const { error } = await supabase
      .from("events")
      .update({
        name: formData.get("name") as string,
        name_en: (formData.get("name_en") as string) || null,
        img: formData.get("img") as string,
        date: formData.get("date") as string,
        type: formData.get("type") as EventType,
        time: formData.get("time") as string,
        presenters: parseArrayField((formData.get("presenters") as string) || ""),
        links: parseArrayField((formData.get("links") as string) || ""),
        description: (formData.get("description") as string) || null,
        description_en: (formData.get("description_en") as string) || null,
      })
      .eq("id", id);

    if (error) {
      throw new ActionError("SERVER_ERROR", error.message);
    }

    revalidateEventPaths();
  }
);

/**
 * Change only an event's image (admin-only). Used by the AI chat image picker to re-pick.
 * Returns the updated event.
 */
export const setEventImage = adminAction(async (id: string, img: string): Promise<Event> => {
  if (!/^https:\/\//.test(img)) throw new ActionError("VALIDATION", "Image must be an https URL");
  const supabase = createServerClient();
  const { data, error } = await supabase.from("events").update({ img }).eq("id", id).select().single();
  if (error) throw new ActionError("SERVER_ERROR", error.message);
  revalidateEventPaths();
  return data as Event;
});

/**
 * Delete an event (admin-only)
 */
export const deleteEvent = adminAction(async (id: string) => {
  const supabase = createServerClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw new ActionError("SERVER_ERROR", error.message);
  }

  revalidateEventPaths();
});

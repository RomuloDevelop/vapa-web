"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "../supabase-server";
import { getEvents, getEventsCount } from "../services/events";
import type { Event, EventType } from "../database.types";

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

export async function fetchFilteredEvents(
  params: EventsFilterParams
): Promise<FilteredEventsResult> {
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

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

function parseArrayField(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("events")
    .insert({
      name: formData.get("name") as string,
      img: formData.get("img") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as EventType,
      time: formData.get("time") as string,
      presenters: parseArrayField(formData.get("presenters") as string || ""),
      links: parseArrayField(formData.get("links") as string || ""),
      description: (formData.get("description") as string) || null,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/digital-library");
  revalidatePath("/admin/events");

  return { success: true, id: data.id };
}

export async function updateEvent(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("events")
    .update({
      name: formData.get("name") as string,
      img: formData.get("img") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as EventType,
      time: formData.get("time") as string,
      presenters: parseArrayField(formData.get("presenters") as string || ""),
      links: parseArrayField(formData.get("links") as string || ""),
      description: formData.get("description") as string || null,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/digital-library");
  revalidatePath("/admin/events");

  return { success: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = createServerClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/digital-library");
  revalidatePath("/admin/events");

  return { success: true };
}


import { createPublicServerClient } from "../supabase-server";
import type { Event } from "../database.types";

export interface EventFilters {
  year?: number;
  type?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch events from the database with optional filtering
 * Use in Server Components, API Routes, or Server Actions
 */
export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  const supabase = createPublicServerClient();
  let query = supabase.from("events").select("*").order("date", { ascending: false });

  if (filters?.year) {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query.gte("date", startDate).lte("date", endDate);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching events:", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch a single event by ID
 */
export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching event:", error);
    throw error;
  }

  return data;
}

/**
 * Get unique years from events for filtering
 */
export async function getEventYears(): Promise<number[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("date")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching event years:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const years = new Set(data.map((e: { date: string }) => new Date(e.date).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Get unique event types for filtering
 */
export async function getEventTypes(): Promise<string[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase.from("events").select("type");

  if (error) {
    console.error("Error fetching event types:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return Array.from(new Set(data.map((e: { type: string }) => e.type))).sort();
}

/**
 * Get total count of events (with optional filters)
 */
export async function getEventsCount(filters?: EventFilters): Promise<number> {
  const supabase = createPublicServerClient();
  let query = supabase.from("events").select("*", { count: "exact", head: true });

  if (filters?.year) {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query.gte("date", startDate).lte("date", endDate);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching events count:", error);
    throw error;
  }

  return count ?? 0;
}

/**
 * Get upcoming events (events with date >= today)
 */
export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  const supabase = createPublicServerClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Get recent past events
 */
export async function getRecentEvents(limit = 3): Promise<Event[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent events:", error);
    throw error;
  }

  return data ?? [];
}

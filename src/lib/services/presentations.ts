import { createServerClient } from "../supabase-server";
import type { Presentation } from "../database.types";

export interface PresentationFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch presentations from the database with optional filtering.
 * Uses authenticated client — callers must enforce auth via action guards.
 */
export async function getPresentations(
  filters?: PresentationFilters
): Promise<Presentation[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("presentations")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching presentations:", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch a single presentation by ID.
 */
export async function getPresentationById(
  id: string
): Promise<Presentation | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("presentations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching presentation:", error);
    throw error;
  }

  return data;
}

/**
 * Get total count of presentations (with optional search filter).
 */
export async function getPresentationsCount(search?: string): Promise<number> {
  const supabase = createServerClient();
  let query = supabase
    .from("presentations")
    .select("*", { count: "exact", head: true });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { count, error } = await query;

  if (error) {
    console.error("Error fetching presentations count:", error);
    throw error;
  }

  return count ?? 0;
}

/**
 * Insert a new presentation into the database.
 */
export async function insertPresentation(data: {
  title: string;
  title_en?: string | null;
  description: string | null;
  description_en?: string | null;
  img: string;
  file_path: string;
}): Promise<{ id: string }> {
  const supabase = createServerClient();

  const { data: row, error } = await supabase
    .from("presentations")
    .insert(data)
    .select("id")
    .single();

  if (error) throw error;
  return { id: row.id };
}

/**
 * Update an existing presentation.
 */
export async function updatePresentationRecord(
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("presentations")
    .update(data)
    .eq("id", id);

  if (error) throw error;
}

/**
 * Delete a presentation record AND its file from storage.
 */
export async function deletePresentationRecord(id: string): Promise<void> {
  const supabase = createServerClient();

  // Get the file path first
  const { data: presentation, error: fetchError } = await supabase
    .from("presentations")
    .select("file_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete file from storage
  if (presentation?.file_path) {
    const { error: storageError } = await supabase.storage
      .from("presentations")
      .remove([presentation.file_path]);

    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      // Don't throw — still proceed with DB deletion
    }
  }

  // Delete the DB record
  const { error } = await supabase
    .from("presentations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Generate a signed URL for a presentation file (60-second expiry).
 */
export async function createSignedDownloadUrl(
  filePath: string
): Promise<string> {
  const supabase = createServerClient();

  const { data, error } = await supabase.storage
    .from("presentations")
    .createSignedUrl(filePath, 60);

  if (error) throw error;
  return data.signedUrl;
}

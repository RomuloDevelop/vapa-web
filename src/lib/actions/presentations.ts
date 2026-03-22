"use server";

import { revalidatePath } from "next/cache";
import {
  getPresentations,
  getPresentationsCount,
  getPresentationById,
  insertPresentation,
  updatePresentationRecord,
  deletePresentationRecord,
  createSignedDownloadUrl,
} from "../services/presentations";
import { memberAction, adminAction } from "./safe-action";
import type { Presentation } from "../database.types";

const PAGE_SIZE = 10;

export interface PresentationsFilterParams {
  search?: string;
  page?: number;
}

export interface FilteredPresentationsResult {
  presentations: Presentation[];
  totalCount: number;
}

const PRESENTATION_REVALIDATION_PATHS = [
  "/digital-library/presentations",
  "/admin/presentations",
];

function revalidatePresentationPaths() {
  PRESENTATION_REVALIDATION_PATHS.forEach((path) => revalidatePath(path));
}

// ── Read actions (member-accessible) ────────────────────────────────────────

/**
 * Fetch filtered presentations with pagination (for admin SWR table).
 */
export const fetchFilteredPresentations = memberAction(
  async (
    params: PresentationsFilterParams
  ): Promise<FilteredPresentationsResult> => {
    const { search, page = 1 } = params;
    const offset = (page - 1) * PAGE_SIZE;

    const filters = { search, limit: PAGE_SIZE, offset };

    const [presentations, totalCount] = await Promise.all([
      getPresentations(filters),
      getPresentationsCount(search),
    ]);

    return { presentations, totalCount };
  }
);

/**
 * Fetch all presentations (for public page server-side initial load).
 */
export const fetchPresentations = memberAction(
  async (): Promise<Presentation[]> => {
    return getPresentations();
  }
);

/**
 * Fetch initial presentations with count (for admin page server-side load).
 */
export const fetchPresentationsWithCount = memberAction(
  async (): Promise<{ presentations: Presentation[]; totalCount: number }> => {
    const [presentations, totalCount] = await Promise.all([
      getPresentations({ limit: PAGE_SIZE, offset: 0 }),
      getPresentationsCount(),
    ]);
    return { presentations, totalCount };
  }
);

/**
 * Fetch a single presentation by ID (for edit page).
 */
export const fetchPresentationById = memberAction(
  async (id: string): Promise<Presentation | null> => {
    return getPresentationById(id);
  }
);

/**
 * Generate a signed URL for a presentation file (member-accessible).
 * 60-second expiry prevents URL sharing with non-members.
 */
export const getSignedUrl = memberAction(
  async (filePath: string): Promise<{ signedUrl: string }> => {
    const signedUrl = await createSignedDownloadUrl(filePath);
    return { signedUrl };
  }
);

// ── Write actions (admin-only) ──────────────────────────────────────────────

/**
 * Create a new presentation (admin-only).
 */
export const createPresentation = adminAction(
  async (formData: FormData): Promise<{ id: string }> => {
    const result = await insertPresentation({
      title: formData.get("title") as string,
      title_en: (formData.get("title_en") as string) || null,
      description: (formData.get("description") as string) || null,
      description_en: (formData.get("description_en") as string) || null,
      img: formData.get("img") as string,
      file_path: formData.get("file_path") as string,
    });

    revalidatePresentationPaths();
    return result;
  }
);

/**
 * Update an existing presentation (admin-only).
 */
export const updatePresentation = adminAction(
  async (id: string, formData: FormData) => {
    const updateData: Record<string, unknown> = {
      title: formData.get("title") as string,
      title_en: (formData.get("title_en") as string) || null,
      description: (formData.get("description") as string) || null,
      description_en: (formData.get("description_en") as string) || null,
      img: formData.get("img") as string,
    };

    // Only update file_path if a new file was uploaded
    const filePath = formData.get("file_path") as string;
    if (filePath) {
      updateData.file_path = filePath;
    }

    await updatePresentationRecord(id, updateData);
    revalidatePresentationPaths();
  }
);

/**
 * Delete a presentation and its file from storage (admin-only).
 */
export const deletePresentation = adminAction(async (id: string) => {
  await deletePresentationRecord(id);
  revalidatePresentationPaths();
});

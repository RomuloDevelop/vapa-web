import { createServerClient } from "../supabase-server";
import type { Donation, DonationInsert } from "../database.types";

/**
 * Insert a new donation record.
 * Uses stripe_session_id UNIQUE constraint for idempotency.
 */
export async function insertDonation(
  data: DonationInsert
): Promise<{ id: string }> {
  const supabase = createServerClient();

  const { data: row, error } = await supabase
    .from("donations")
    .insert(data)
    .select("id")
    .single();

  if (error) throw error;
  return { id: row.id };
}

/**
 * Check if a donation record already exists for a given Stripe session.
 */
export async function getDonationBySessionId(
  sessionId: string
): Promise<Donation | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  // PGRST116 = "not found" which is expected
  if (error && error.code !== "PGRST116") throw error;

  return data ?? null;
}

// ─── Admin listing ──────────────────────────────────────────────────────────

export interface DonationsFilter {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export async function getDonations(
  filters: DonationsFilter = {}
): Promise<Donation[]> {
  const supabase = createServerClient();
  const { search, dateFrom, dateTo, limit = 10, offset = 0 } = filters;

  let query = supabase
    .from("donations")
    .select("*")
    .order("donation_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(
      `donor_name.ilike.%${search}%,donor_email.ilike.%${search}%`
    );
  }
  if (dateFrom) query = query.gte("donation_date", dateFrom);
  if (dateTo) query = query.lte("donation_date", dateTo);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getDonationsCount(
  filters: Omit<DonationsFilter, "limit" | "offset"> = {}
): Promise<number> {
  const supabase = createServerClient();
  const { search, dateFrom, dateTo } = filters;

  let query = supabase
    .from("donations")
    .select("*", { count: "exact", head: true });

  if (search) {
    query = query.or(
      `donor_name.ilike.%${search}%,donor_email.ilike.%${search}%`
    );
  }
  if (dateFrom) query = query.gte("donation_date", dateFrom);
  if (dateTo) query = query.lte("donation_date", dateTo);

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

/**
 * Mark a donation's receipt email as sent.
 */
export async function markReceiptSent(donationId: string): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("donations")
    .update({ receipt_email_sent: true })
    .eq("id", donationId);

  if (error) throw error;
}

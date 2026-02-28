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

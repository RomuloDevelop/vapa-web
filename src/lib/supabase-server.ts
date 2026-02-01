import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Server-side Supabase client with secret key
 * For admin operations (bypasses RLS)
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "Missing Supabase server environment variables. Please set SUPABASE_URL and SUPABASE_SECRET_KEY"
    );
  }

  return createClient<Database>(supabaseUrl, supabaseSecretKey);
}

/**
 * Server-side Supabase client with publishable key
 * For read-only operations respecting RLS
 */
export function createPublicServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}

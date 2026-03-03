import crypto from "crypto";
import { createServerClient } from "../supabase-server";
import type { User } from "../database.types";

// ─── Read operations ────────────────────────────────────────────────────────

/**
 * Fetch all users ordered by creation date (excludes password_hash)
 */
export async function getUsers(): Promise<(User & { has_password: boolean })[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, password_hash, name, role, membership_tier, is_active, invitation_token, invitation_expires, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  // Strip password_hash, expose only a boolean flag for the client
  return (data ?? []).map((user) => ({
    ...user,
    has_password: !!user.password_hash,
  })) as (User & { has_password: boolean })[];
}

/**
 * Get total count of users
 */
export async function getUsersCount(): Promise<number> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching users count:", error);
    throw error;
  }

  return count ?? 0;
}

/**
 * Check if an email belongs to an active user
 */
export async function isActiveUser(email: string): Promise<boolean> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("email", email.toLowerCase())
    .eq("is_active", true);

  if (error) {
    console.error("Error checking active user:", error);
    return false;
  }

  return (count ?? 0) > 0;
}

/**
 * Get a user's profile by email
 */
export async function getUserByEmail(
  email: string
): Promise<{ name: string; membership_tier: string } | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("name, membership_tier")
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }

  return data;
}

// ─── Write operations ───────────────────────────────────────────────────────

/**
 * Insert a new user (without password — invitation flow)
 */
export async function insertUser(data: {
  email: string;
  name: string;
  role: "admin" | "member";
  membership_tier: string;
}): Promise<{ id: string }> {
  const supabase = createServerClient();
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: data.email.toLowerCase().trim(),
      name: data.name,
      role: data.role,
      membership_tier: data.membership_tier,
    })
    .select("id")
    .single();

  if (error) throw error;
  return user!;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, password_hash, name, role, membership_tier, is_active, invitation_token, invitation_expires, reset_token, reset_expires, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as User;
}

/**
 * Update a user's active status
 */
export async function updateUserActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Update a user's role
 */
export async function updateUserRole(
  id: string,
  role: "admin" | "member"
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Update a user's editable fields
 */
export async function updateUser(
  id: string,
  data: {
    name?: string;
    role?: "admin" | "member";
    membership_tier?: string;
    is_active?: boolean;
  }
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update(data)
    .eq("id", id);

  if (error) throw error;
}

// ─── Invitation token operations ────────────────────────────────────────────

/**
 * Generate a random invitation token, store it in the DB (48h expiry)
 */
export async function generateInvitationToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update({ invitation_token: token, invitation_expires: expires })
    .eq("id", userId);

  if (error) throw error;
  return token;
}

/**
 * Validate an invitation token — returns the user if valid and not expired
 */
export async function validateInvitationToken(
  token: string
): Promise<User | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, name, role, membership_tier, is_active, invitation_token, invitation_expires, created_at"
    )
    .eq("invitation_token", token)
    .single();

  if (error || !data) return null;

  // Check expiry
  if (
    data.invitation_expires &&
    new Date(data.invitation_expires) < new Date()
  ) {
    return null;
  }

  return data as User;
}

/**
 * Set password from invitation token, then clear the token
 */
export async function setPasswordFromInvitation(
  token: string,
  passwordHash: string
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update({
      password_hash: passwordHash,
      invitation_token: null,
      invitation_expires: null,
    })
    .eq("invitation_token", token);

  if (error) throw error;
}

// ─── Reset token operations ────────────────────────────────────────────────

/**
 * Generate a random reset token, store it in the DB (1h expiry)
 */
export async function generateResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update({ reset_token: token, reset_expires: expires })
    .eq("id", userId);

  if (error) throw error;
  return token;
}

/**
 * Validate a reset token — returns the user if valid and not expired
 */
export async function validateResetToken(
  token: string
): Promise<User | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, name, role, membership_tier, is_active, invitation_token, invitation_expires, reset_token, reset_expires, created_at"
    )
    .eq("reset_token", token)
    .single();

  if (error || !data) return null;

  // Check expiry
  if (data.reset_expires && new Date(data.reset_expires) < new Date()) {
    return null;
  }

  return data as User;
}

/**
 * Set password from reset token, then clear the token
 */
export async function setPasswordFromResetToken(
  token: string,
  passwordHash: string
): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("users")
    .update({
      password_hash: passwordHash,
      reset_token: null,
      reset_expires: null,
    })
    .eq("reset_token", token);

  if (error) throw error;
}

/**
 * Get an active user by email who has a password set (eligible for reset)
 */
export async function getUserByEmailForReset(
  email: string
): Promise<User | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, name, role, membership_tier, is_active, invitation_token, invitation_expires, reset_token, reset_expires, created_at"
    )
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .not("password_hash", "is", null)
    .single();

  if (error || !data) return null;
  return data as User;
}

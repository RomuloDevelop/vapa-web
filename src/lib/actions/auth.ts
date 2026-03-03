"use server";

import { auth, getSession } from "@/lib/auth";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import {
  validateInvitationToken,
  setPasswordFromInvitation,
  getUserByEmailForReset,
  generateResetToken,
  validateResetToken as validateResetTokenService,
  setPasswordFromResetToken,
} from "@/lib/services/members";
import { sendPasswordResetEmail } from "@/lib/services/email";
import { registerSchema } from "@/lib/schemas";

// ─── Public registration ────────────────────────────────────────────────────

export async function registerUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { success: false, error: firstError };
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const { createServerClient } = await import("@/lib/supabase-server");
    const supabase = createServerClient();

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        name: `${firstName} ${lastName}`,
        role: "member",
        membership_tier: "active",
        is_active: false,
        password_hash: passwordHash,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "An account with this email already exists." };
      }
      throw error;
    }

    await upsertCredentialAccount(user!.id, passwordHash);

    return { success: true };
  } catch (error) {
    console.error("Error in registerUser:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Login ──────────────────────────────────────────────────────────────────

export async function loginWithCredentials(email: string, password: string) {
  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    console.error(error)
    return { success: false, error: "Invalid email or password." };
  }
}

export async function logout() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch {
    // Ignore errors on sign out
  }
}

export async function getAuthUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Validate an invitation token (used by set-password page to check before rendering form)
 */
export async function validateToken(token: string) {
  const user = await validateInvitationToken(token);
  if (!user) {
    return { valid: false as const };
  }
  return { valid: true as const, name: user.name, email: user.email };
}

/**
 * Set password from an invitation token
 */
export async function setPassword(token: string, password: string) {
  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const user = await validateInvitationToken(token);
  if (!user) {
    return { success: false, error: "Invalid or expired invitation link." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await setPasswordFromInvitation(token, passwordHash);
  await upsertCredentialAccount(user.id, passwordHash);

  return { success: true };
}

// ─── Password reset ─────────────────────────────────────────────────────────

/**
 * Request a password reset email.
 * Always returns success to prevent email enumeration.
 */
export async function requestPasswordReset(email: string) {
  try {
    const user = await getUserByEmailForReset(email);

    if (user) {
      const token = await generateResetToken(user.id);
      await sendPasswordResetEmail(user.email, user.name, token);
    }
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
  }

  // Always return success to prevent email enumeration
  return { success: true };
}

/**
 * Validate a reset token (used by reset-password page before rendering form)
 */
export async function validateResetToken(token: string) {
  const user = await validateResetTokenService(token);
  if (!user) {
    return { valid: false as const };
  }
  return { valid: true as const, email: user.email };
}

/**
 * Reset password using a valid reset token
 */
export async function resetPassword(token: string, password: string) {
  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const user = await validateResetTokenService(token);
  if (!user) {
    return { success: false, error: "Invalid or expired reset link." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await setPasswordFromResetToken(token, passwordHash);
  await upsertCredentialAccount(user.id, passwordHash);

  return { success: true };
}

// ── Helper: sync password to Better Auth account table ──────────────

async function upsertCredentialAccount(userId: string, passwordHash: string) {
  const { createServerClient } = await import("@/lib/supabase-server");
  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from("account")
    .select("id")
    .eq("user_id", userId)
    .eq("provider_id", "credential")
    .single();

  if (existing) {
    await supabase
      .from("account")
      .update({ password: passwordHash, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    const crypto = await import("crypto");
    await supabase.from("account").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      account_id: userId,
      provider_id: "credential",
      password: passwordHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
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

export async function loginWithCredentials(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirect: false });
}

export async function getAuthUser() {
  const session = await auth();
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

  return { success: true };
}

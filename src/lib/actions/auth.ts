"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import {
  validateInvitationToken,
  setPasswordFromInvitation,
} from "@/lib/services/members";

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

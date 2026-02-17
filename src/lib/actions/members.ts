"use server";

import { revalidatePath } from "next/cache";
import {
  getUsers,
  insertUser,
  deleteUser,
  updateUserActive,
  generateInvitationToken,
} from "@/lib/services/members";
import { sendInvitationEmail } from "@/lib/services/email";
import { adminAction, ActionError } from "./safe-action";
import type { User } from "@/lib/database.types";

export type UserWithStatus = User & { has_password: boolean };

/**
 * Fetch all users (admin-only, used by SWR)
 */
export const fetchUsers = adminAction(async (): Promise<UserWithStatus[]> => {
  return getUsers();
});

/**
 * Add a new user and send invitation email
 */
export const addMember = adminAction(async (formData: FormData) => {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const name = (formData.get("name") as string)?.trim();
  const tier = formData.get("membership_tier") as string;
  const role = (formData.get("role") as string) || "member";

  if (!email || !name) {
    throw new ActionError("VALIDATION", "Email and name are required", {
      ...(!email ? { email: "Email is required" } : {}),
      ...(!name ? { name: "Name is required" } : {}),
    });
  }

  let userId: string;

  try {
    const user = await insertUser({
      email,
      name,
      role: role as "admin" | "member",
      membership_tier: tier || "active",
    });
    userId = user.id;
  } catch (error: unknown) {
    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      throw new ActionError("CONFLICT", "This email is already registered", {
        email: "This email is already registered",
      });
    }
    throw error;
  }

  // Generate invitation token and send email
  const token = await generateInvitationToken(userId);
  const emailResult = await sendInvitationEmail(email, name, token);

  if (!emailResult.success) {
    console.error("Failed to send invitation email:", emailResult.error);
    // User was created but email failed — don't throw, admin can resend later
  }

  revalidatePath("/admin/members");
});

/**
 * Resend invitation email to a user who hasn't set their password yet
 */
export const resendInvitation = adminAction(async (userId: string) => {
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new ActionError("NOT_FOUND", "User not found");
  }

  if (user.password_hash) {
    throw new ActionError("VALIDATION", "User has already set their password");
  }

  const token = await generateInvitationToken(userId);
  const emailResult = await sendInvitationEmail(user.email, user.name, token);

  if (!emailResult.success) {
    throw new ActionError(
      "SERVER_ERROR",
      emailResult.error || "Failed to send invitation email"
    );
  }

  revalidatePath("/admin/members");
});

/**
 * Delete a user
 */
export const deleteMember = adminAction(async (id: string) => {
  await deleteUser(id);
  revalidatePath("/admin/members");
});

/**
 * Toggle a user's active status
 */
export const toggleMemberActive = adminAction(
  async (id: string, isActive: boolean) => {
    await updateUserActive(id, isActive);
    revalidatePath("/admin/members");
  }
);

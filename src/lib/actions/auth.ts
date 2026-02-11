"use server";

import { createAuthClient } from "@/lib/supabase-auth";
import { redirect } from "next/navigation";

export async function sendMagicLink(email: string, redirectTo: string) {
  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getAuthUser() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

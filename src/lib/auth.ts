import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials.email as string)?.toLowerCase().trim();
        const password = credentials.password as string;
        if (!email || !password) return null;

        const supabase = createServerClient();
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .eq("is_active", true)
          .single();

        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          membershipTier: user.membership_tier,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.membershipTier = user.membershipTier;
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.role = token.role as "admin" | "member";
      session.user.membershipTier = token.membershipTier as string;
      return session;
    },
  },
});

/**
 * Require any authenticated user in a server component.
 * Redirects to login if no valid session exists.
 */
export async function requireMemberAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Require admin role in a server component.
 * Redirects to login if not an admin.
 */
export async function requireAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }
  return session;
}

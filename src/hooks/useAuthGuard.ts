"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function useAuthGuard(redirectTo = "/login") {
  const router = useRouter();
  const { data, isPending } = useSession();

  const isAuthenticated = !!data?.user;

  if (!isPending && !isAuthenticated) {
    router.replace(redirectTo);
  }

  return {
    session: data
      ? {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: (data.user as Record<string, unknown>).role as "admin" | "member",
            membershipTier: (data.user as Record<string, unknown>).membershipTier as string,
          },
        }
      : null,
    status: isPending ? "loading" : isAuthenticated ? "authenticated" : "unauthenticated",
    isLoading: isPending,
    isAuthorized: isAuthenticated,
  };
}

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useAuthGuard(redirectTo = "/login") {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.replace(redirectTo);
  }

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthorized: status === "authenticated",
  };
}

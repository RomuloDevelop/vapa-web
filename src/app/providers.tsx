"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useSession } from "@/lib/auth-client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { setErrorUser } from "@/lib/error-tracking";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname;
      const params = searchParams?.toString();
      if (params) {
        url = url + "?" + params;
      }
      posthogClient.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthogClient]);

  return null;
}

function UserIdentifier() {
  const { data } = useSession();
  const posthogClient = usePostHog();

  useEffect(() => {
    const user = data?.user;
    const userId = user?.id ?? user?.email;
    if (user && userId) {
      posthogClient.identify(userId, {
        email: user.email,
        name: user.name,
      });
      setErrorUser({ id: userId, email: user.email ?? undefined });
    }
  }, [data, posthogClient]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      <UserIdentifier />
      {children}
    </PHProvider>
  );
}

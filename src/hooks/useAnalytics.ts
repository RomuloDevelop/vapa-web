"use client";

import { usePostHog } from "posthog-js/react";
import { clearErrorUser } from "@/lib/error-tracking";

export function useAnalytics() {
  const posthog = usePostHog();

  return {
    identify: (id: string, properties?: Record<string, unknown>) =>
      posthog.identify(id, properties),
    reset: () => {
      posthog.reset();
      clearErrorUser();
    },
    capture: (event: string, properties?: Record<string, unknown>) =>
      posthog.capture(event, properties),
  };
}

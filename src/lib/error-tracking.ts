import * as Sentry from "@sentry/nextjs";

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export function captureError(error: unknown, context?: ErrorContext) {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
  });
}

export function setErrorUser(user: { id: string; email?: string }) {
  Sentry.setUser(user);
}

export function clearErrorUser() {
  Sentry.setUser(null);
}

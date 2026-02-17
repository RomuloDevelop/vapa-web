// ─── Error Codes ─────────────────────────────────────────────────────────────

export const ERROR_CODES = {
  VALIDATION: "VALIDATION",
  UNAUTHORIZED: "UNAUTHORIZED",
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ─── Error Data (serializable, sent to client) ──────────────────────────────

export interface ActionErrorData {
  code: ErrorCode;
  message: string;
  fields?: Record<string, string>;
}

// ─── ActionResult Discriminated Union ────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: ActionErrorData };

// ─── ActionError Class ───────────────────────────────────────────────────────

export class ActionError extends Error {
  public readonly code: ErrorCode;
  public readonly fields?: Record<string, string>;

  constructor(
    code: ErrorCode,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = "ActionError";
    this.code = code;
    this.fields = fields;
  }
}

// ─── Client-side: unwrap ─────────────────────────────────────────────────────

/**
 * Extract data from an ActionResult or throw on error.
 * Use with SWR fetchers or anywhere you don't need to inspect the error manually.
 *
 * @example
 * // SWR — auto-unwrap, SWR catches the throw
 * useSWR("key", () => unwrap(fetchMembers()))
 *
 * // Simple mutation — just want success or throw
 * await unwrap(deleteMember(id));
 */
export async function unwrap<T>(
  result: ActionResult<T> | Promise<ActionResult<T>>
): Promise<T> {
  const resolved = await result;
  if (resolved.success) return resolved.data;
  throw new ActionError(
    resolved.error.code,
    resolved.error.message,
    resolved.error.fields
  );
}

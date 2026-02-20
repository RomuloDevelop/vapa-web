import { z } from "zod";

// ── Event Form ──────────────────────────────────────────────────────────────

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  type: z.enum(["webinar", "special_event"], {
    message: "Event type is required",
  }),
  date: z.string().min(1, "Date is required"),
  time: z.string(),
  img: z.string().min(1, "Image is required"),
  links: z.string(),
  presenters: z.string(),
  description: z.string(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

// ── Presentation Form ───────────────────────────────────────────────────────

export const presentationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  img: z.string().min(1, "Cover image is required"),
  file_path: z.string().min(1, "File is required"),
});

export type PresentationFormValues = z.infer<typeof presentationSchema>;

// ── Add Member Form ─────────────────────────────────────────────────────────

export const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.enum(["member", "admin"]),
  membership_tier: z.string().min(1, "Membership tier is required"),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;

// ── Login Form ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ── Forgot Password Form ───────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ── Reset Password Form ────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

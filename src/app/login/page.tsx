"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { signIn } from "@/lib/auth-client";

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "You do not have permission to access that page.",
};

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-border-accent-light focus:border-accent";

const errorInputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-red-500 focus:border-red-500";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");
  const errorParam = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    errorParam ? ERROR_MESSAGES[errorParam] || null : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setServerError(null);

    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setServerError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl || "/");
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-8 p-8 rounded-xl bg-surface-section border border-border-accent-light">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
          <Lock className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="text-sm text-foreground-muted text-center">
          Access the VAPA members area with your credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground-muted"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your.email@example.com"
            autoComplete="email"
            className={errors.email ? errorInputClass : inputClass}
          />
          {errors.email && (
            <span className="text-xs text-red-400">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground-muted"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            autoComplete="current-password"
            className={errors.password ? errorInputClass : inputClass}
          />
          {errors.password && (
            <span className="text-xs text-red-400">{errors.password.message}</span>
          )}
          <Link
            href="/auth/forgot-password"
            className="text-xs text-accent hover:underline self-end mt-1"
          >
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <p className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to site
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

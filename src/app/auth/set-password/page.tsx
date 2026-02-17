"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";
import { validateToken, setPassword } from "@/lib/actions/auth";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [state, setState] = useState<"loading" | "form" | "invalid" | "success">("loading");
  const [name, setName] = useState("");
  const [password, setPassword_] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }

    validateToken(token).then((result) => {
      if (result.valid) {
        setName(result.name);
        setState("form");
      } else {
        setState("invalid");
      }
    });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await setPassword(token!, password);
    setSubmitting(false);

    if (result.success) {
      setState("success");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-8 p-8 rounded-xl bg-surface-section border border-border-accent-light">
      {state === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-foreground-muted">Validating invitation...</p>
        </div>
      )}

      {state === "invalid" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-400/10">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Invalid Invitation</h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            This invitation link is invalid or has expired. Please contact your administrator to request a new one.
          </p>
        </div>
      )}

      {state === "success" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-20">
            <CheckCircle className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-white">Password Set!</h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Your password has been set successfully. Redirecting to login...
          </p>
        </div>
      )}

      {state === "form" && (
        <>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-20">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-white">Set Your Password</h1>
            <p className="text-sm text-foreground-muted text-center">
              Welcome, <span className="text-white font-medium">{name}</span>! Create a password to activate your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword_(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border-accent-light text-white placeholder:text-foreground-faint text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground-muted">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border-accent-light text-white placeholder:text-foreground-faint text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <Suspense
        fallback={
          <div className="w-full max-w-[400px] flex flex-col items-center gap-3 p-8 rounded-xl bg-surface-section border border-border-accent-light">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-foreground-muted">Loading...</p>
          </div>
        }
      >
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}

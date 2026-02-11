"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendMagicLink } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const redirectTo = `${window.location.origin}/admin/auth/callback`;
    const result = await sendMagicLink(email, redirectTo);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Failed to send login link");
      return;
    }

    setSent(true);
    toast.success("Check your email for the login link");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] flex flex-col gap-8 p-8 rounded-xl bg-surface-section border border-border-accent-light">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-accent" />
          <h1 className="text-2xl font-bold text-white">VAPA Admin</h1>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-foreground-muted text-sm leading-relaxed">
              We sent a login link to{" "}
              <span className="text-white font-medium">{email}</span>. Check
              your inbox and click the link to sign in.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-accent hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vapa-us.org"
                required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border-accent-light text-white placeholder:text-foreground-faint text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

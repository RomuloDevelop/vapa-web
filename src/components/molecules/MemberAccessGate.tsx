import Link from "next/link";
import { Lock } from "lucide-react";

interface MemberAccessGateProps {
  description: string;
}

export function MemberAccessGate({ description }: MemberAccessGateProps) {
  return (
    <section className="flex flex-col items-center gap-6 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-24 bg-surface-elevated">
      <div className="flex flex-col items-center gap-4 max-w-lg text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-20">
          <Lock className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Members Only</h2>
        <p className="text-foreground-muted leading-relaxed">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <Link
            href="/login"
            className="px-6 py-3 bg-accent text-surface text-sm font-semibold rounded hover:opacity-90 transition-opacity text-center"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 text-foreground text-sm font-medium rounded border border-border-accent-strong hover:bg-accent-10 transition-colors text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { LayoutDashboard, Calendar, Users, LogOut, Menu, ExternalLink, Presentation, Heart } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Loader } from "@/components/atoms";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Presentations", href: "/admin/presentations", icon: Presentation },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Donations", href: "/admin/donations", icon: Heart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, isLoading, isAuthorized } = useAuthGuard("/login");
  const analytics = useAnalytics();

  // Skip layout for login page
  if (pathname === "/admin/login" || pathname.startsWith("/admin/auth")) {
    return <>{children}</>;
  }

  if (!isAuthorized) return isLoading ? <Loader /> : null;

  const handleLogout = async () => {
    analytics.reset();
    await signOut({ fetchOptions: { onSuccess: () => router.replace("/") } });
  };

  return (
    <div className={`${inter.className} flex min-h-screen bg-surface`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-sunken border-r border-border-accent-light flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-end px-6 py-5 border-b border-border-accent-light">
          <Image src="/vapa-icon.png" alt="VAPA logo" width={24} height={24} className="w-8 h-8 shrink-0" />

          <span className="text-xl font-bold text-foreground">VAPA</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent-20 text-accent"
                    : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-border-accent-light flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-border-accent-light bg-surface-sunken">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 lg:hidden text-foreground-muted hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          {session?.user?.email && (
            <span className="text-xs text-foreground-subtle">
              {session.user.email}
            </span>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 pb-20 lg:p-8 lg:pb-24">{children}</main>
      </div>
    </div>
  );
}

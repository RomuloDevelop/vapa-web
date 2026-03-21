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
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Menu,
  ExternalLink,
  Presentation,
  Heart,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Loader } from "@/components/atoms";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Presentations", href: "/admin/presentations", icon: Presentation },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Donations", href: "/admin/donations", icon: Heart },
];

const SIDEBAR_EXPANDED_W = "w-64";
const SIDEBAR_COLLAPSED_W = "w-16";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
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

  // On desktop: show labels if expanded OR if collapsed but hovered
  const showLabels = expanded || hovered;
  // The actual rendered width of the sidebar visual
  const sidebarVisualWidth = showLabels ? "16rem" : "4rem";

  return (
    <div className={`${inter.className} flex min-h-screen bg-surface`}>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-sunken border-r border-border-accent-light flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          showLabels={true}
          onNavClick={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Desktop sidebar - spacer (reserves layout space) */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W
        }`}
      />

      {/* Desktop sidebar - visual */}
      <motion.aside
        onMouseEnter={() => !expanded && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ width: sidebarVisualWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`hidden lg:flex fixed inset-y-0 left-0 z-50 bg-surface-sunken border-r border-border-accent-light flex-col ${
          !expanded && hovered ? "shadow-2xl" : ""
        }`}
      >
        <SidebarContent
          pathname={pathname}
          showLabels={showLabels}
          onNavClick={() => {}}
          onLogout={handleLogout}
          toggleButton={
            <button
              onClick={() => {
                setExpanded(!expanded);
                setHovered(false);
              }}
              className="p-2 rounded-lg text-foreground-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
          }
        />
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-border-accent-light bg-surface-sunken">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 lg:hidden text-foreground-muted hover:text-white"
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

function SidebarContent({
  pathname,
  showLabels,
  onNavClick,
  onLogout,
  toggleButton,
}: {
  pathname: string;
  showLabels: boolean;
  onNavClick: () => void;
  onLogout: () => void;
  toggleButton?: React.ReactNode;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border-accent-light">
        <div className="flex items-end gap-0 overflow-hidden">
          <Image
            src="/vapa-icon.png"
            alt="VAPA logo"
            width={24}
            height={24}
            className="w-8 h-8 shrink-0"
          />
          <AnimatePresence>
            {showLabels && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-white whitespace-nowrap overflow-hidden"
              >
                VAPA
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {toggleButton}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
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
              onClick={onNavClick}
              title={!showLabels ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                showLabels ? "" : "justify-center"
              } ${
                isActive
                  ? "bg-accent-20 text-accent"
                  : "text-foreground-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {showLabels && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-border-accent-light flex flex-col gap-1">
        <Link
          href="/"
          title={!showLabels ? "View Site" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-foreground-muted hover:text-white hover:bg-white/5 transition-colors ${
            showLabels ? "" : "justify-center"
          }`}
        >
          <ExternalLink className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {showLabels && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                View Site
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={onLogout}
          title={!showLabels ? "Logout" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-foreground-muted hover:text-white hover:bg-white/5 transition-colors ${
            showLabels ? "" : "justify-center"
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {showLabels && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}

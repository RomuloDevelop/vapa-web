"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronDown, Linkedin, Instagram, Youtube, LogOut, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut as memberSignOut } from "@/lib/auth-client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { navigationConfig, MEMBERSHIP_URL, socialLinks, type NavItem, type NavSubItem } from "@/config/navigation";

const socialIconMap = {
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
} as const;

interface HeaderProps {
  variant?: "solid" | "gradient";
  activeNav?: string;
  showJoinButton?: boolean;
}

const SCROLL_THRESHOLD = 500; // px before hide/show kicks in

export function Header({ variant = "solid", activeNav = "Home", showJoinButton = true }: HeaderProps) {
  const { data: sessionData } = useSession();
  const memberSession = sessionData ? { user: { ...sessionData.user, role: (sessionData.user as Record<string, unknown>).role as string } } : null;
  const analytics = useAnalytics();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHasScrolled(currentY > 10);

      if (isMenuOpen) {
        lastScrollY.current = currentY;
        return;
      }

      if (currentY < SCROLL_THRESHOLD) {
        setIsHeaderVisible(true);
      } else if (currentY > (lastScrollY.current + 15)) {
        setIsHeaderVisible(false);
        setOpenDropdown(null);
      } else if (currentY < (lastScrollY.current - 5)) {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-dropdown-container]")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up close timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Keyboard handler for desktop dropdown triggers
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent, itemLabel: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpenDropdown((prev) => (prev === itemLabel ? null : itemLabel));
      } else if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    },
    []
  );

  const isGradient = variant === "gradient";

  const scrollToElement = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isItemActive = (item: NavItem) => {
    if (item.label === activeNav) return true;
    if (item.children) {
      return item.children.some((child) => child.label === activeNav);
    }
    return false;
  };

  // Split children into columns for mega menu
  const splitIntoColumns = (children: NavSubItem[], numColumns: number): NavSubItem[][] => {
    const columns: NavSubItem[][] = Array.from({ length: numColumns }, () => []);
    children.forEach((child, index) => {
      columns[index % numColumns].push(child);
    });
    return columns;
  };

  const MegaMenuItem = ({ child, onClose }: { child: NavSubItem; onClose: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isChildDisabled = !child.href;

    if (isChildDisabled) {
      return (
        <div className="mega-menu-item" aria-disabled="true">
          <span className="mega-menu-item-title">{child.label}</span>
          {child.description && (
            <span className="mega-menu-item-description">{child.description}</span>
          )}
        </div>
      );
    }

    return (
      <Link
        href={child.href}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mega-menu-item"
      >
        <span
          className="mega-menu-item-title"
          style={{ color: isHovered ? "var(--color-primary)" : undefined }}
        >
          {child.label}
        </span>
        {child.description && (
          <span className="mega-menu-item-description">{child.description}</span>
        )}
      </Link>
    );
  };

  const renderDesktopNavItem = (item: NavItem) => {
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isDisabled = !item.href;

    // Item with children (mega menu dropdown)
    if (hasChildren) {
      const desktopChildren = item.children!.filter((child) => !child.mobileOnly);
      const columns = splitIntoColumns(desktopChildren, 2);

      return (
        <div
          key={item.label}
          className="relative"
          data-dropdown-container
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
            setOpenDropdown(item.label);
          }}
          onMouseLeave={() => {
            closeTimeoutRef.current = setTimeout(() => {
              setOpenDropdown(null);
              closeTimeoutRef.current = null;
            }, 300);
          }}
          onKeyDown={(e) => { if (e.key === "Escape") { setOpenDropdown(null); e.stopPropagation(); } }}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={`flex items-center gap-1.5 text-sm xl:text-[15px] font-medium transition-colors hover:text-accent ${
                isActive || openDropdown === item.label ? "text-accent" : "text-foreground-muted"
              }`}
              aria-haspopup="true"
              aria-expanded={openDropdown === item.label}
              onKeyDown={(e) => handleDropdownKeyDown(e, item.label)}
            >
              {item.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === item.label ? "rotate-180" : ""
                }`}
              />
            </Link>
          ) : (
            <button
              className={`flex items-center gap-1.5 text-sm xl:text-[15px] font-medium transition-colors hover:text-accent ${
                isActive || openDropdown === item.label ? "text-accent" : "text-foreground-muted"
              }`}
              aria-haspopup="true"
              aria-expanded={openDropdown === item.label}
              onKeyDown={(e) => handleDropdownKeyDown(e, item.label)}
            >
              {item.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === item.label ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          <AnimatePresence>
            {openDropdown === item.label && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  paddingTop: "8px",
                }}
              >
                {/* Pointer arrow */}
                <div className="mega-menu-pointer" />

                {/* Dropdown wrapper with height animation */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mega-menu-wrapper  backdrop-blur"
                  style={{ marginTop: "12px" }}
                >
                  {/* Dropdown content */}
                  <div className="mega-menu-dropdown">
                    {columns.map((column, colIndex) => (
                      <motion.div
                        key={colIndex}
                        className="mega-menu-column"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: colIndex * 0.08,
                          ease: "easeOut",
                        }}
                      >
                        {column.map((child, childIndex) => (
                          <motion.div
                            key={child.label}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.25,
                              delay: colIndex * 0.08 + childIndex * 0.05,
                              ease: "easeOut",
                            }}
                          >
                            <MegaMenuItem child={child} onClose={() => setOpenDropdown(null)} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Disabled item (empty href)
    if (isDisabled) {
      return (
        <span
          key={item.label}
          className="text-sm xl:text-[15px] font-medium text-foreground-faint cursor-not-allowed"
          aria-disabled="true"
        >
          {item.label}
        </span>
      );
    }

    // External link
    if (item.external) {
      return (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-accent ${
            isActive ? "text-accent" : "text-foreground-muted"
          }`}
        >
          {item.label}
        </a>
      );
    }

    // Scroll to element
    if (item.scrollTo) {
      return (
        <button
          key={item.label}
          onClick={(e) => scrollToElement(e, item.href)}
          className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-accent ${
            isActive ? "text-accent" : "text-foreground-muted"
          }`}
        >
          {item.label}
        </button>
      );
    }

    // Regular link
    return (
      <Link
        key={item.label}
        href={item.href}
        className={`text-sm xl:text-[15px] font-medium transition-colors hover:text-accent ${
          isActive ? "text-accent" : "text-foreground-muted"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  const renderMobileNavItem = (item: NavItem, index: number) => {
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = mobileExpandedItem === item.label;
    const isDisabled = !item.href;

    // Item with children (expandable)
    if (hasChildren) {
      return (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <div
            className={`flex items-center justify-between w-full py-4 text-lg font-medium border-b border-border-accent-light/30 ${
              isActive ? "text-accent" : "text-foreground-muted"
            }`}
          >
            {item.href ? (
              <Link
                href={item.href}
                className="flex-1 py-1 transition-colors hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="flex-1 py-1"
                onClick={() => setMobileExpandedItem(isExpanded ? null : item.label)}
              >
                {item.label}
              </span>
            )}
            <button
              onClick={() => setMobileExpandedItem(isExpanded ? null : item.label)}
              className="p-2 -mr-2 transition-colors hover:text-accent"
              aria-label={isExpanded ? `Collapse ${item.label} submenu` : `Expand ${item.label} submenu`}
              aria-expanded={isExpanded}
              aria-controls={`mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
                id={`mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                role="region"
                aria-label={`${item.label} submenu`}
              >
                <div className="pl-4 py-2 space-y-1">
                  {item.children!.map((child) => {
                    const isChildDisabled = !child.href;
                    if (isChildDisabled) {
                      return (
                        <span
                          key={child.label}
                          className="block py-3 text-base text-foreground-subtle"
                          aria-disabled="true"
                        >
                          {child.label}
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`block py-3 text-base transition-colors hover:text-accent ${
                          child.label === activeNav
                            ? "text-accent"
                            : "text-foreground-subtle"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    // Disabled item
    if (isDisabled) {
      return (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <span className="block py-4 text-lg font-medium text-foreground-faint border-b border-border-accent-light/30 cursor-not-allowed" aria-disabled="true">
            {item.label}
          </span>
        </motion.div>
      );
    }

    // External link
    if (item.external) {
      return (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block py-4 text-lg font-medium transition-colors hover:text-accent border-b border-border-accent-light/30 ${
              isActive ? "text-accent" : "text-foreground-muted"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        </motion.div>
      );
    }

    // Scroll to element
    if (item.scrollTo) {
      return (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <button
            className={`block w-full text-left py-4 text-lg font-medium transition-colors hover:text-accent border-b border-border-accent-light/30 ${
              isActive ? "text-accent" : "text-foreground-muted"
            }`}
            onClick={(e) => {
              setIsMenuOpen(false);
              setTimeout(() => scrollToElement(e, item.href), 300);
            }}
          >
            {item.label}
          </button>
        </motion.div>
      );
    }

    // Regular link
    return (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 + 0.1 }}
      >
        <Link
          href={item.href}
          className={`block py-4 text-lg font-medium transition-colors hover:text-accent border-b border-border-accent-light/30 ${
            isActive ? "text-accent" : "text-foreground-muted"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {item.label}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isGradient
            ? hasScrolled ? "bg-surface/95 backdrop-blur-md" : "bg-gradient-header"
            : hasScrolled ? "bg-surface/95 backdrop-blur-md" : "bg-surface"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-10 lg:px-20 md:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/vapa-icon.png" alt="VAPA logo" width={40} height={40} priority className="w-10 h-10 md:w-12 md:h-12 shrink-0" />
            <span className="text-2xl md:text-[28px] font-bold text-white">VAPA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navigationConfig.map((item) => renderDesktopNavItem(item))}
          </nav>

          {/* Desktop Social + CTA */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-8 h-8 rounded-md text-foreground-muted hover:text-accent transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Member Status (only shown when logged in) */}
            {!!memberSession?.user && (
              <>
                <div className="w-px h-6 bg-border-accent-light" />
                <div className="flex items-center gap-3">
                  {memberSession.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    <span className="text-xs text-foreground-subtle max-w-[120px] truncate">
                      {memberSession.user.name || memberSession.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => { analytics.reset(); memberSignOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } }); }}
                    className="flex items-center gap-1 text-xs text-foreground-faint hover:text-accent transition-colors"
                    aria-label="Log out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Divider */}
            <div className={`w-px h-6 bg-border-accent-light ${showJoinButton ? "" : "invisible"}`} />

            {/* CTA Button */}
            <a
              href={MEMBERSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 text-xs font-semibold rounded hover:opacity-90 transition-opacity bg-accent text-surface ${
                showJoinButton ? "" : "invisible"
              }`}
            >
              Join VAPA
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header on non-gradient pages */}
      {!isGradient && <div className="h-[72px] md:h-[88px]" />}

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out Panel */}
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-label="Navigation menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[70vw] max-w-[320px] bg-surface z-50 lg:hidden overflow-y-auto"
              onKeyDown={(e) => { if (e.key === "Escape") setIsMenuOpen(false); }}
            >
              <div className="flex flex-col min-h-full">
                {/* Menu Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-border-accent-light">
                  <Image src="/vapa-icon.png" alt="VAPA logo" width={40} height={40} priority className="w-10 h-10 object-contain shrink-0" />
                  <span className="text-2xl font-bold text-white">VAPA</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col flex-1 px-6 py-6">
                  {navigationConfig.map((item, index) => renderMobileNavItem(item, index))}
                </nav>

                {/* Social Links + CTA Button */}
                <div className="px-6 py-6 mt-auto flex flex-col gap-5">
                  {/* Social Icons */}
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social) => {
                      const Icon = socialIconMap[social.icon];
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="flex items-center justify-center w-10 h-10 rounded-md border border-accent-30 hover:border-accent text-accent transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>

                  {/* Member Status (Mobile) - only shown when logged in */}
                  {!!memberSession?.user && (
                    <div className="flex flex-col gap-2">
                      {memberSession.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 py-3 px-4 rounded-lg bg-accent-10 border border-accent-30 text-sm font-medium text-accent"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-surface-section border border-border-accent-light">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-accent" />
                          <span className="text-sm text-foreground-subtle truncate max-w-[150px]">
                            {memberSession.user.name || memberSession.user.email}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            analytics.reset();
                            memberSignOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
                          }}
                          className="text-xs text-foreground-faint hover:text-accent transition-colors"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}

                  <a
                    href={MEMBERSHIP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-accent text-surface text-base font-semibold rounded hover:opacity-90 transition-opacity text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join VAPA
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

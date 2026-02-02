"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { navigationConfig, MEMBERSHIP_URL, type NavItem, type NavSubItem } from "@/config/navigation";

interface HeaderProps {
  variant?: "solid" | "gradient";
  activeNav?: string;
  showJoinButton?: boolean;
}

export function Header({ variant = "solid", activeNav = "Home", showJoinButton = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="mega-menu-item">
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
          style={{ color: isHovered ? "#D4A853" : undefined }}
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
      const columns = splitIntoColumns(item.children!, 3);

      return (
        <div
          key={item.label}
          className="relative"
          ref={dropdownRef}
          onMouseEnter={() => setOpenDropdown(item.label)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className={`flex items-center gap-1.5 text-sm xl:text-[15px] font-medium transition-colors hover:text-accent ${
              isActive || openDropdown === item.label ? "text-accent" : "text-foreground-muted"
            }`}
          >
            {item.label}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === item.label ? "rotate-180" : ""
              }`}
            />
          </button>

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
                {/* Invisible hover bridge to prevent flickering */}
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "192px",
                    height: "24px",
                  }}
                />

                {/* Pointer arrow */}
                <div className="mega-menu-pointer" />

                {/* Dropdown wrapper with height animation */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mega-menu-wrapper"
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
          <button
            onClick={() => setMobileExpandedItem(isExpanded ? null : item.label)}
            className={`flex items-center justify-between w-full py-4 text-lg font-medium transition-colors border-b border-border-accent-light/30 ${
              isActive ? "text-accent" : "text-foreground-muted"
            }`}
          >
            {item.label}
            <ChevronDown
              className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-4 py-2 space-y-1">
                  {item.children!.map((child) => {
                    const isChildDisabled = !child.href;
                    if (isChildDisabled) {
                      return (
                        <span
                          key={child.label}
                          className="block py-3 text-base text-foreground-subtle"
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
          <span className="block py-4 text-lg font-medium text-foreground-faint border-b border-border-accent-light/30 cursor-not-allowed">
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
        className={`${isGradient ? "absolute top-0 left-0 right-0 bg-gradient-header" : "relative bg-surface"} z-50`}
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-10 lg:px-20 md:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-accent" />
            <span className="text-2xl md:text-[28px] font-bold text-white">VAPA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navigationConfig.map((item) => renderDesktopNavItem(item))}
          </nav>

          {/* Desktop CTA Button */}
          <a
            href={MEMBERSHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:block px-5 lg:px-7 py-3 lg:py-3.5 text-sm font-semibold rounded hover:opacity-90 transition-opacity bg-accent text-surface ${
              showJoinButton ? "" : "invisible"
            }`}
          >
            Join VAPA
          </a>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[70vw] max-w-[320px] bg-surface z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col min-h-full">
                {/* Menu Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-border-accent-light">
                  <div className="w-10 h-10 rounded-lg bg-gradient-accent" />
                  <span className="text-2xl font-bold text-white">VAPA</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col flex-1 px-6 py-6">
                  {navigationConfig.map((item, index) => renderMobileNavItem(item, index))}
                </nav>

                {/* CTA Button */}
                <div className="px-6 py-6 mt-auto">
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

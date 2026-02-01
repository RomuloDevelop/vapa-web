"use client";

import { type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: never;
  external?: never;
}

interface ButtonAsLink extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-dark font-semibold hover:opacity-90",
  secondary:
    "text-white font-medium border border-border-gold-strong bg-black/20 backdrop-blur-sm hover:bg-white/10",
  outline:
    "border border-border-gold text-gold hover:bg-gold-tint-10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 md:px-9 py-4 md:py-[18px] text-sm md:text-base",
  lg: "px-8 md:px-12 py-4 md:py-5 text-sm md:text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = `rounded transition-colors text-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, external, ...anchorProps } = props;
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className={baseClasses}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const { ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={baseClasses} {...buttonProps}>
      {children}
    </button>
  );
}

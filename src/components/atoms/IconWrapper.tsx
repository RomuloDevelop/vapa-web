import type { LucideIcon } from "lucide-react";

type IconSize = "sm" | "md" | "lg" | "xl";
type IconVariant = "default" | "primary" | "muted";

interface IconWrapperProps {
  icon: LucideIcon;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
}

const sizeConfig: Record<IconSize, { wrapper: string; icon: string }> = {
  sm: {
    wrapper: "w-10 h-10",
    icon: "w-5 h-5",
  },
  md: {
    wrapper: "w-12 h-12 md:w-14 md:h-14",
    icon: "w-6 h-6 md:w-7 md:h-7",
  },
  lg: {
    wrapper: "w-14 h-14",
    icon: "w-6 h-6",
  },
  xl: {
    wrapper: "w-16 h-16",
    icon: "w-7 h-7",
  },
};

const variantConfig: Record<IconVariant, { wrapper: string; icon: string }> = {
  default: {
    wrapper: "bg-accent-20",
    icon: "text-accent",
  },
  primary: {
    wrapper: "bg-accent",
    icon: "text-surface",
  },
  muted: {
    wrapper: "bg-accent-15",
    icon: "text-accent",
  },
};

export function IconWrapper({
  icon: Icon,
  size = "md",
  variant = "default",
  className = "",
}: IconWrapperProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  return (
    <div
      className={`flex items-center justify-center rounded-full ${sizeStyles.wrapper} ${variantStyles.wrapper} ${className}`}
    >
      <Icon className={`${sizeStyles.icon} ${variantStyles.icon}`} />
    </div>
  );
}

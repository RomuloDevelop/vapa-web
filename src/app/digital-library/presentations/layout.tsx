"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Loader } from "@/components/atoms";

export default function PresentationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useAuthGuard("/login");

  if (!isAuthorized) return isLoading ? <Loader /> : null;

  return <>{children}</>;
}

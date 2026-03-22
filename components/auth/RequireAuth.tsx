"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    const next =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [loading, user, router, pathname, searchParams]);

  if (loading) return null;
  if (!user) return null;

  return children;
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/firebase/firebase.config";
import { isUserRole } from "@/components/auth/authTypes";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const rawRole = userSnap.data()?.role;
        const role = isUserRole(rawRole) ? rawRole : undefined;
        const isAdmin = role === "admin";
        if (cancelled) return;
        if (!isAdmin) {
          router.replace("/");
        } else {
          setChecking(false);
        }
      } catch (e) {
        console.error("Failed to check admin role", e);
        if (!cancelled) router.replace("/");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  if (checking) return null;

  return <>{children}</>;
}

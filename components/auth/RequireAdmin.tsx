"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase.config";
import { useAuth } from "@/components/auth/AuthProvider";

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
        const snap = await getDoc(doc(db, "users", user.uid));
        const isAdmin = snap.exists() && snap.data().role === "admin";
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


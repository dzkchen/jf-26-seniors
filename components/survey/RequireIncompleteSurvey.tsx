"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase.config";
import { useAuth } from "@/components/auth/AuthProvider";

export function RequireIncompleteSurvey({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setChecking(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const hasCompleted = snap.exists() && snap.data().hasCompletedSurvey;
        if (!cancelled) {
          if (hasCompleted) {
            router.replace("/thanks");
          } else {
            setChecking(false);
          }
        }
      } catch (e) {
        console.error("Failed to check survey completion", e);
        setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  if (checking) return null;

  return <>{children}</>;
}
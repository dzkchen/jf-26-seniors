"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

function getSafeRedirectTarget(next: string | null) {
  if (!next) return "/survey";
  if (!next.startsWith("/") || next.startsWith("//")) return "/survey";
  return next;
}

export default function LoginCard({ next }: { next?: string }) {
  const router = useRouter();
  const { signInWithGoogle, error, loading, user } = useAuth();
  const redirectTarget = getSafeRedirectTarget(next ?? null);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTarget);
    }
  }, [loading, user, router, redirectTarget]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <h1 className="text-3xl font-bold tracking-tighter text-center">
        Fraser Senior Survey
      </h1>
      <p className="text-gray-600 text-center">
        Please log in with your Peel Email to access the survey.
      </p>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        type="button"
        disabled={loading}
      >
        Sign in with Google
      </Button>
    </motion.div>
  );
}

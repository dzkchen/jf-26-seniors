"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginCard() {
  const router = useRouter();
  const { signInWithGoogle, error, loading, user } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  useEffect(() => {
    if (!loading && user) {
      router.replace("/survey");
    }
  }, [loading, user, router]);

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


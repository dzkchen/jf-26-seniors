"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { signOutNow } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);
    try {
      await signOutNow();
      router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={signingOut}
      className="min-w-[110px] rounded-full border-slate-200 bg-white/90 text-[#15375c] shadow-sm hover:bg-slate-50"
    >
      <LogOut className="size-4" aria-hidden />
      {signingOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}

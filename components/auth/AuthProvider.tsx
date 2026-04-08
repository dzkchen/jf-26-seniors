"use client";

import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth, db } from "@/firebase/firebase.config";
import { clearSurveyDraft } from "@/components/survey/draftStorage";
import { isUserRole, type UserRole } from "@/components/auth/authTypes";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_STARTED_AT_KEY = "jfss_session_started_at";
const UNAUTHORIZED_MESSAGE =
  "please login with your Peel Email, if error persists please contact david @zkc.david";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string;
  signInWithGoogle: (opts?: { redirectTo?: string }) => Promise<void>;
  signOutNow: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getSessionStartedAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_STARTED_AT_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function setSessionStartedAtNow() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STARTED_AT_KEY, String(Date.now()));
}

function clearSessionStartedAt() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_STARTED_AT_KEY);
}

async function isEmailAllowed(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  const snap = await getDoc(doc(db, "allowed_emails", normalizedEmail));
  return snap.exists();
}

async function syncSignedInUser(u: User) {
  const email = u.email ?? "";
  if (!email) {
    throw new Error("missing-email");
  }

  const normalizedEmail = normalizeEmail(email);

  const tokenResult = await u.getIdTokenResult(true);
  if (tokenResult.claims.email_verified !== true) {
    throw new Error("email-not-verified");
  }

  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    throw new Error("email-not-allowed");
  }

  const userRef = doc(db, "users", u.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const existingRole = userSnap.data().role;
    const role: UserRole = isUserRole(existingRole) ? existingRole : "student";

    await setDoc(
      userRef,
      {
        email: normalizedEmail,
        displayName: u.displayName ?? "",
        role,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    await setDoc(userRef, {
      email: normalizedEmail,
      displayName: u.displayName ?? "",
      hasCompletedSurvey: false,
      role: "student",
      updatedAt: serverTimestamp(),
    });
  }
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "missing-email") return UNAUTHORIZED_MESSAGE;
    if (error.message === "email-not-verified") {
      return "your Google account email is not verified, so Firestore access is blocked";
    }
    if (error.message === "email-not-allowed") return UNAUTHORIZED_MESSAGE;
  }

  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "sign-in worked, but Firestore denied access. Double-check the deployed Firestore rules for allowed_emails and users.";
  }

  return UNAUTHORIZED_MESSAGE;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {
    });

    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setError("");

      if (!u) {
        setUser(null);
        clearSessionStartedAt();
        setLoading(false);
        return;
      }

      const startedAt = getSessionStartedAt();
      if (startedAt && Date.now() - startedAt > SESSION_TTL_MS) {
        clearSurveyDraft(u.uid);
        await signOut(auth);
        clearSessionStartedAt();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        await syncSignedInUser(u);
        if (!startedAt) {
          setSessionStartedAtNow();
        }
        setUser(u);
      } catch (e) {
        console.error("Failed to initialize signed-in user", e);
        clearSurveyDraft(u.uid);
        await signOut(auth);
        clearSessionStartedAt();
        setUser(null);
        setError(getAuthErrorMessage(e));
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signOutNow: async () => {
        setError("");
        if (user) clearSurveyDraft(user.uid);
        await signOut(auth);
        clearSessionStartedAt();
      },
      signInWithGoogle: async () => {
        setLoading(true);
        setError("");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
          await signInWithPopup(auth, provider);
        } catch (e) {
          console.error(e);
          setLoading(false);
          setError(getAuthErrorMessage(e));
        }
      },
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

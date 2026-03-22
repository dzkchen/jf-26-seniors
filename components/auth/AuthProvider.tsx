"use client";

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
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth, db } from "@/firebase/firebase.config";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_STARTED_AT_KEY = "jfss_session_started_at";
const UNAUTHORIZED_MESSAGE =
  "please login with your Peel Email, if error persists please contact david @zkc.david";

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
  const q = query(
    collection(db, "allowed_emails"),
    where("email", "==", email.toLowerCase())
  );
  const snap = await getDocs(q);
  return !snap.empty;
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
        await signOut(auth);
        clearSessionStartedAt();
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(u);
      setLoading(false);
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
        await signOut(auth);
        clearSessionStartedAt();
      },
      signInWithGoogle: async (opts) => {
        setError("");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
          const result = await signInWithPopup(auth, provider);
          const u = result.user;

          const email = u.email ?? "";
          if (!email) {
            await signOut(auth);
            clearSessionStartedAt();
            setError(UNAUTHORIZED_MESSAGE);
            return;
          }

          const allowed = await isEmailAllowed(email);
          if (!allowed) {
            await signOut(auth);
            clearSessionStartedAt();
            setError(UNAUTHORIZED_MESSAGE);
            return;
          }

          setSessionStartedAtNow();

          await setDoc(
            doc(db, "users", u.uid),
            {
              email: email.toLowerCase(),
              displayName: u.displayName ?? "",
              hasCompletedSurvey: false,
              role: "student",
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          await setDoc(
            doc(db, "users", u.uid),
            {
              email: email.toLowerCase(),
              displayName: u.displayName ?? "",
              hasCompletedSurvey: false,
              role: "student",
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.error(e);
          setError(UNAUTHORIZED_MESSAGE);
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


'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { motion } from "motion/react"
import { Button } from "@/components/ui/button";

export default function LoginCard() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (user.email?.endsWith("@pdsb.net")) {
                router.push("/survey");
            } else {
                setError("Please sign in with your pdsb email.");
            }
        } catch (err) {
            console.error(err);
            setError("Error please contact David!");
        }
    };

    return (
        <div className="flex items-center justify-center p-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                <h1 className="text-3xl font-bold tracking-tighter text-center">Fraser Senior Survey</h1>
                <p className="text-gray-600 mb-6 text-center">Thank you for taking the time to complete this survey. Please login via your pdsb email.</p>
                <form className="space-y-4">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="items-center">
                        <Button variant="outline" className="w-full text-center" onClick={handleGoogleSignIn} type="button">Sign in with Google</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
'use client'

import { motion } from "motion/react"
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center p-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    <h1 className="text-3xl font-bold tracking-tighter text-center">Fraser Senior Survey</h1>
                    <p className="text-gray-600 mb-6 text-center">Thank you for taking the time to complete this survey. Please login via your pdsb email.</p>
                    <form className="space-y-4">
                        <div className="items-center">
                            <Button variant="outline" className="w-full text-center">Google</Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
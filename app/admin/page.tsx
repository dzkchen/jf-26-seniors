import Image from "next/image";

import { Navbar } from "@/components/ui/navbar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src="/hero-bg.png"
          fill
          className="object-cover"
          alt=""
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(228, 248, 255, 0.85)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="w-[90%] max-w-6xl mx-auto mt-4 sm:mt-6">
          <div
            className="rounded-2xl px-4 py-2 shadow-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
          >
            <Navbar />
          </div>
        </div>

        <RequireAuth>
          <RequireAdmin>
            <section className="flex-1 px-4 sm:px-6 py-8 sm:py-10">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#15375c]">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Aggregated statistics from all submitted private surveys.
              </p>
              <AdminDashboard />
            </section>
          </RequireAdmin>
        </RequireAuth>
      </div>
    </main>
  );
}

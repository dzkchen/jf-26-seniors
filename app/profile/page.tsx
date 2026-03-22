import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";

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

        <section className="flex-1 flex items-center justify-center px-6 py-16 text-center">
          <div
            className="rounded-2xl px-8 py-10 shadow-md border border-white/80"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <p className="text-xl sm:text-2xl text-foreground">
              🛠️🦺 <br />
              Under Construction, Check Back in June!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

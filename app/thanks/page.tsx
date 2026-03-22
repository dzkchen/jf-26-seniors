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

        <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
          <div className="w-full max-w-2xl rounded-2xl px-6 sm:px-10 py-10 sm:py-12 shadow-md border border-white/80 bg-white/90 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-[#15375c]">
              Thank you for submitting this survey
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Your responses have been saved. Your profile will appear on the
              Stay Connected page once it has been approved.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              If you believe there is an error with your submission, please
              contact david @zkc.david.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";
import Link from "next/link";

const COLORS = {
  navy: "#15375c",
  deep: "#0e3c6f",
};

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

        <section className="w-[90%] max-w-4xl mx-auto mt-10 sm:mt-14 pb-24 sm:pb-32 space-y-14">
          <div
            className="rounded-2xl p-6 sm:p-8 shadow-md border border-white/80"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 text-center"
              style={{ color: COLORS.navy }}
            >
              About the Program
            </h2>
            <p className="text-base sm:text-lg" style={{ color: COLORS.deep }}>
              to be filled
            </p>

            <div className="mt-8">
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-sm">
                <Image
                  src="/class-photo.jpg"
                  alt="Class photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 800px"
                />
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Senior Sunrise Photo 2025
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 sm:p-8 shadow-md border border-white/80"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 text-center"
              style={{ color: COLORS.navy }}
            >
              Preface
            </h2>
            <p className="text-base sm:text-lg" style={{ color: COLORS.deep }}>
              to be filled
            </p>
          </div>

          <div
            className="rounded-2xl p-6 sm:p-8 shadow-md border border-white/80"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6 text-center"
              style={{ color: COLORS.navy }}
            >
              Contributors
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <Link
                  href="https://www.linkedin.com/in/davidzekaichen"
                  target="_blank"
                  rel="noreferrer"
                  className="group"
                  aria-label="David Chen LinkedIn"
                >
                  <div className="relative size-28 sm:size-32 overflow-hidden rounded-full ring-2 ring-black/5 shadow-sm group-hover:ring-black/10 transition">
                    <Image
                      src="https://github.com/dzkchen.png?size=256"
                      alt="David Chen"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                </Link>
                <div className="mt-4">
                  <div
                    className="font-bold text-lg"
                    style={{ color: COLORS.navy }}
                  >
                    David Chen
                  </div>
                  <div className="text-sm" style={{ color: COLORS.deep }}>
                    Project Lead
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

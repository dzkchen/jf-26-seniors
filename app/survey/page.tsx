import { Navbar } from "@/components/ui/navbar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireIncompleteSurvey } from "@/components/survey/RequireIncompleteSurvey";
import { MultiStepSurveyForm } from "@/components/survey/MultiStepSurveyForm";
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

        <RequireAuth>
          <RequireIncompleteSurvey>
            <section className="flex-1 flex items-start justify-center px-4 sm:px-6 py-10 sm:py-12">
              <div className="w-full max-w-4xl rounded-2xl px-4 sm:px-8 py-8 sm:py-10 shadow-md border border-white/80 bg-white/90 text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#15375c]">
                  Senior Survey
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  Please take your time filling this out. You{" "}
                  <span className="font-semibold">can only submit once</span>.
                </p>

                <MultiStepSurveyForm />
              </div>
            </section>
          </RequireIncompleteSurvey>
        </RequireAuth>
      </div>
    </main>
  );
}

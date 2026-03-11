"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase.config";
import { Navbar } from "@/components/ui/navbar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import Image from "next/image";

type PrivateSurveyDoc = {
  id: string;
  // Academics
  grade11Avg?: number;
  grade12Preparedness?: number;
  sem1MidtermAvg?: number;
  sem1FinalAvg?: number;
  sem2MidtermAvg?: number;
  // Lifestyle & habits
  avgStudyTime?: number;
  allNighters?: number;
  exerciseFreq?: number;
  avgSleepTime?: number;
  avgScreenTime?: number;
  procrastinationFreq?: number;
  // Wellbeing
  stressLevelSem1?: number;
  stressLevelSem2?: number;
  cohortFriendliness?: number;
  peerSupportLevel?: number;
  burnoutLevel?: number;
  // Engagement / post-secondary
  clubsCount?: number;
  collegesAppliedCount?: number;
  intendedField?: string;
  favouriteCourse?: string;
  mostUsefulCourse?: string;
  mostDifficultCourse?: string;
  cohortDescriptionWords?: string;
  biggestHelpSucceeding?: string;
  redoGrade12Reflections?: string;
  adviceForG12s?: string;
  collegesAppliedList?: string;
};

type PublicProfileDoc = {
  id: string;
  firstName?: string;
  lastName?: string;
  university?: string;
  major?: string;
  quote?: string;
  instagramHandle?: string;
  linkedinUrl?: string;
  isApproved?: boolean;
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

        <RequireAuth>
          <RequireAdmin>
            <section className="flex-1 px-4 sm:px-6 py-8 sm:py-10">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#15375c]">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Aggregated statistics from all submitted private surveys.
              </p>
              <AdminCharts />
            </section>
          </RequireAdmin>
        </RequireAuth>
      </div>
    </main>
  );
}

function AdminCharts() {
  const [data, setData] = useState<PrivateSurveyDoc[]>([]);
  const [profiles, setProfiles] = useState<PublicProfileDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [privateSnap, publicSnap] = await Promise.all([
          getDocs(collection(db, "private_survey")),
          getDocs(collection(db, "public_profiles")),
        ]);

        const privateDocs: PrivateSurveyDoc[] = [];
        privateSnap.forEach((d) => {
          const base = d.data() as Omit<PrivateSurveyDoc, "id">;
          privateDocs.push({ id: d.id, ...base });
        });

        const publicDocs: PublicProfileDoc[] = [];
        publicSnap.forEach((d) => {
          const base = d.data() as Omit<PublicProfileDoc, "id">;
          publicDocs.push({ id: d.id, ...base });
        });

        setData(privateDocs);
        setProfiles(publicDocs);
      } catch (e) {
        console.error(e);
        setError("Failed to load survey data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading survey statistics…
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No survey submissions found yet.
      </p>
    );
  }

  const downloadCsv = () => {
    const headers = [
      "id",
      "grade11Avg",
      "grade12Preparedness",
      "sem1MidtermAvg",
      "sem1FinalAvg",
      "sem2MidtermAvg",
      "avgStudyTime",
      "allNighters",
      "exerciseFreq",
      "avgSleepTime",
      "avgScreenTime",
      "procrastinationFreq",
      "stressLevelSem1",
      "stressLevelSem2",
      "cohortFriendliness",
      "peerSupportLevel",
      "burnoutLevel",
      "clubsCount",
      "collegesAppliedCount",
      "favouriteCourse",
      "mostUsefulCourse",
      "mostDifficultCourse",
      "intendedField",
      "collegesAppliedList",
      "cohortDescriptionWords",
      "biggestHelpSucceeding",
      "redoGrade12Reflections",
      "adviceForG12s",
    ];

    const rows = data.map((d) =>
      headers
        .map((key) => {
          const value = (d as any)[key];
          if (value == null) return "";
          const s = String(value).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "survey-responses.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={downloadCsv}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#15375c] shadow-sm hover:bg-slate-50"
        >
          Download all responses (CSV)
        </button>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-[#15375c]">
          Individual Responses (all fields)
        </h2>
        <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2">
          {data.map((d, index) => (
            <div
              key={d.id}
              className="rounded-xl border border-slate-200/70 bg-white/90 p-3 sm:p-4 text-xs sm:text-sm"
            >
              <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                Response #{index + 1}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-medium">Grade 11 avg:</span>{" "}
                  {d.grade11Avg ?? "—"}
                </div>
                <div>
                  <span className="font-medium">G12 preparedness (1–5):</span>{" "}
                  {d.grade12Preparedness ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Sem1 midterm/final:</span>{" "}
                  {d.sem1MidtermAvg ?? "—"} / {d.sem1FinalAvg ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Sem2 midterm:</span>{" "}
                  {d.sem2MidtermAvg ?? "—"}
                </div>
                <div>
                  <span className="font-medium">
                    Study hrs / day (avg):
                  </span>{" "}
                  {d.avgStudyTime ?? "—"}
                </div>
                <div>
                  <span className="font-medium">All nighters:</span>{" "}
                  {d.allNighters ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Exercise / week:</span>{" "}
                  {d.exerciseFreq ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Sleep hrs / night:</span>{" "}
                  {d.avgSleepTime ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Screen hrs / day:</span>{" "}
                  {d.avgScreenTime ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Procrastination (1–5):</span>{" "}
                  {d.procrastinationFreq ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Stress Sem1 (1–5):</span>{" "}
                  {d.stressLevelSem1 ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Stress Sem2 (1–5):</span>{" "}
                  {d.stressLevelSem2 ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Cohort friendliness (1–5):</span>{" "}
                  {d.cohortFriendliness ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Peer support (1–5):</span>{" "}
                  {d.peerSupportLevel ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Burnout (1–5):</span>{" "}
                  {d.burnoutLevel ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Clubs/teams count:</span>{" "}
                  {d.clubsCount ?? "—"}
                </div>
                <div>
                  <span className="font-medium">
                    Applications submitted:
                  </span>{" "}
                  {d.collegesAppliedCount ?? "—"}
                </div>
                <div>
                  <span className="font-medium">Fav course:</span>{" "}
                  {d.favouriteCourse || "—"}
                </div>
                <div>
                  <span className="font-medium">Most useful:</span>{" "}
                  {d.mostUsefulCourse || "—"}
                </div>
                <div>
                  <span className="font-medium">Most difficult:</span>{" "}
                  {d.mostDifficultCourse || "—"}
                </div>
                <div>
                  <span className="font-medium">Intended field:</span>{" "}
                  {d.intendedField || "—"}
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium">Schools applied:</span>{" "}
                {d.collegesAppliedList || "—"}
              </div>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">Cohort in 1–2 words:</span>{" "}
                  {d.cohortDescriptionWords || "—"}
                </p>
                <p>
                  <span className="font-medium">
                    Biggest thing that helped:
                  </span>{" "}
                  {d.biggestHelpSucceeding || "—"}
                </p>
                <p>
                  <span className="font-medium">If you could redo G12:</span>{" "}
                  {d.redoGrade12Reflections || "—"}
                </p>
                <p>
                  <span className="font-medium">
                    Advice for incoming G12s:
                  </span>{" "}
                  {d.adviceForG12s || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-[#15375c]">
          Public Profiles – Approval
        </h2>
        {profiles.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No public profiles submitted yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-200/70 bg-white/90 px-3 py-2 text-xs sm:text-sm"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#15375c]">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-muted-foreground">
                    {p.university || "University N/A"} ·{" "}
                    {p.major || "Major N/A"}
                  </div>
                  {p.quote && (
                    <div className="text-[11px] italic text-slate-600">
                      “{p.quote}”
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      p.isApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.isApproved ? "Approved" : "Pending"}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setUpdatingId(p.id);
                        await updateDoc(doc(db, "public_profiles", p.id), {
                          isApproved: !p.isApproved,
                        });
                        setProfiles((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, isApproved: !p.isApproved } : x
                          )
                        );
                      } catch (e) {
                        console.error("Failed to update approval", e);
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                    disabled={updatingId === p.id}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-[#15375c] shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  >
                    {p.isApproved ? "Revoke" : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


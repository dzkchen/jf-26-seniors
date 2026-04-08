"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase.config";
import {
  type PrivateSurveyDoc,
  type PublicProfileDoc,
  CSV_HEADERS,
  RESPONSE_GRID_FIELDS,
  RESPONSE_LONG_FIELDS,
} from "./adminTypes";

function hasPopulatedFields(value: Record<string, unknown>) {
  return Object.keys(value).length > 0;
}

function formatCell(d: PrivateSurveyDoc, field: (typeof RESPONSE_GRID_FIELDS)[number]): string {
  if ("keys" in field) {
    const a = d[field.keys[0]] ?? "—";
    const b = d[field.keys[1]] ?? "—";
    return `${a} / ${b}`;
  }
  const v = d[field.key];
  return v != null ? String(v) : "—";
}

function downloadCsv(data: PrivateSurveyDoc[]) {
  const rows = data.map((d) =>
    CSV_HEADERS.map((key) => {
      const value = (d as Record<string, unknown>)[key];
      if (value == null) return "";
      const s = String(value).replace(/"/g, '""');
      return `"${s}"`;
    }).join(",")
  );
  const csv = [CSV_HEADERS.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "survey-responses.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AdminDashboard() {
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
        const privateDocs: PrivateSurveyDoc[] = privateSnap.docs.flatMap((d) => {
          const raw = d.data() as Omit<PrivateSurveyDoc, "id">;
          if (!hasPopulatedFields(raw as Record<string, unknown>)) return [];
          return [{ id: d.id, ...raw }];
        });
        const publicDocs: PublicProfileDoc[] = publicSnap.docs.flatMap((d) => {
          const raw = d.data() as Omit<PublicProfileDoc, "id">;
          if (!hasPopulatedFields(raw as Record<string, unknown>)) return [];
          return [{ id: d.id, ...raw }];
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

  if (loading) return <p className="text-sm text-muted-foreground">Loading survey statistics…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data.length && !profiles.length) {
    return <p className="text-sm text-muted-foreground">No survey submissions found yet.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => downloadCsv(data)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#15375c] shadow-sm hover:bg-slate-50"
        >
          Download all responses (CSV)
        </button>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-[#15375c]">Individual Responses (all fields)</h2>
        {data.length === 0 ? (
          <p className="text-xs text-muted-foreground">No completed private survey submissions yet.</p>
        ) : (
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
                  {RESPONSE_GRID_FIELDS.map((field) => (
                    <div key={"keys" in field ? field.keys.join(",") : field.key}>
                      <span className="font-medium">{field.label}</span> {formatCell(d, field)}
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <span className="font-medium">Schools applied:</span> {d.collegesAppliedList || "—"}
                </div>
                <div className="mt-2 space-y-1">
                  {RESPONSE_LONG_FIELDS.map(({ label, key }) => (
                    <p key={key}>
                      <span className="font-medium">{label}</span> {d[key] || "—"}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-[#15375c]">Public Profiles – Approval</h2>
        {profiles.length === 0 ? (
          <p className="text-xs text-muted-foreground">No public profiles submitted yet.</p>
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
                    {p.university || "University N/A"} · {p.major || "Major N/A"}
                  </div>
                  {p.quote && (
                    <div className="text-[11px] italic text-slate-600">{'"'}{p.quote}{'"'}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      p.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
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
                          prev.map((x) => (x.id === p.id ? { ...x, isApproved: !p.isApproved } : x))
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

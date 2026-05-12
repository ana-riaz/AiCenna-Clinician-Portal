"use client";

import { patientData } from "@/lib/data/patients";
import { HistoryRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HistoryTabProps {
  patientId: string;
}

function tcDot(tc: string) {
  if (tc === "c") return "bg-danger";
  if (tc === "e" || tc === "w") return "bg-warning";
  if (tc === "s" || tc === "g" || tc === "n") return "bg-success";
  return "bg-muted";
}

function tcText(tc: string) {
  if (tc === "c") return "text-danger";
  if (tc === "e" || tc === "w") return "text-warning";
  if (tc === "s" || tc === "g" || tc === "n") return "text-success";
  return "text-dim";
}

interface SectionProps {
  title: string;
  records: HistoryRecord[] | null | undefined;
}

function HistorySection({ title, records }: SectionProps) {
  if (!records?.length) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-glass-border">
        <div className="text-[9px] font-bold text-dim uppercase tracking-wider">{title}</div>
      </div>
      <div className="divide-y divide-[rgba(255,255,255,0.04)]">
        {records.map((r, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", tcDot(r.tc))} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-muted flex-1 min-w-0 break-words">{r.name}</span>
                <span
                  className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex-shrink-0 ml-1",
                    tcText(r.tc)
                  )}
                >
                  {r.tag}
                </span>
              </div>
              <div className="text-[10px] text-dim mt-0.5 leading-relaxed break-words">{r.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoryTab({ patientId }: HistoryTabProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-5 flex flex-col gap-4">
      <HistorySection title="Medical History" records={patient.medHistory} />
      <HistorySection title="Family History" records={patient.famHistory} />
      <HistorySection title="Lifestyle & Habits" records={patient.lifestyle} />
      {patient.femaleSpecific && patient.femaleSpecific.length > 0 && (
        <HistorySection title="Female-Specific History" records={patient.femaleSpecific} />
      )}
    </div>
    </div>
  );
}

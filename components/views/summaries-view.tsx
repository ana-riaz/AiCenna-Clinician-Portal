"use client";

import { FileText } from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { cn, getAvatarClass } from "@/lib/utils";

export function SummariesView() {
  const { alerts, summaryVerified, openPatient } = useApp();
  const pending = alerts
    .filter((alert) => alert.type === "summary" && !alert.read && !summaryVerified[alert.patId])
    .sort((a, b) => b.time - a.time);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-5">
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-glass-border">
            <div className="text-[12px] font-bold text-ink">Pending Summaries</div>
            <div className="text-[10px] text-dim mt-0.5">{pending.length} awaiting verification</div>
          </div>

          {pending.length === 0 ? (
            <div className="px-4 py-10 text-center text-[12px] text-success">All summaries verified.</div>
          ) : (
            <div className="flex flex-col">
              {pending.map((alert) => {
                const patient = patientData[alert.patId];
                if (!patient) return null;

                return (
                  <button
                    key={alert.id}
                    onClick={() => openPatient(patient.id, "ov", "summaries")}
                    className="grid grid-cols-[1fr_160px_100px] gap-3 items-center px-4 py-3 border-b border-white/[0.05] last:border-b-0 text-left hover:bg-white/[0.025] transition-colors"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", getAvatarClass(patient.risk))}>
                        {patient.init}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-muted truncate">{patient.name}</div>
                        <div className="text-[10px] text-dim truncate">{alert.body}</div>
                      </div>
                    </div>

                    <div className="text-[10px] text-dim truncate">{patient.summaryConf} confidence</div>

                    <div className="flex justify-end">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold border bg-success/10 text-success border-success/25">
                        <FileText size={11} />
                        Review
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

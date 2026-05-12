"use client";

import { patientData } from "@/lib/data/patients";
import { cn } from "@/lib/utils";

interface MedicationsTabProps {
  patientId: string;
}

function adherenceColor(a: number) {
  if (a >= 85) return "text-success";
  if (a >= 70) return "text-warning";
  return "text-danger";
}

function dotClass(dot: number) {
  if (dot === 1) return "bg-success/70";
  if (dot === 0) return "bg-danger/60";
  return "bg-white/10";
}

export function MedicationsTab({ patientId }: MedicationsTabProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  const { active, past } = patient.medicationDetail;

  const avgAdherence =
    active.length > 0
      ? Math.round(active.reduce((s, m) => s + m.adherence, 0) / active.length)
      : 0;

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-5 flex flex-col gap-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Active</div>
          <div className="text-xl font-bold text-ink">{active.length}</div>
        </div>
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Past</div>
          <div className="text-xl font-bold text-muted">{past.length}</div>
        </div>
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Allergies</div>
          <div className={cn("text-xl font-bold", patient.allergies.length > 0 ? "text-danger" : "text-success")}>
            {patient.allergies.length}
          </div>
        </div>
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Avg Adherence</div>
          <div className={cn("text-xl font-bold", adherenceColor(avgAdherence))}>{avgAdherence}%</div>
        </div>
      </div>

      {/* Drug allergies */}
      {patient.allergies.length > 0 && (
        <div className="glass-card p-4 border border-danger/20">
          <div className="text-[9px] font-bold text-danger uppercase tracking-wider mb-2">Drug Allergies</div>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((a) => (
              <span
                key={a}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger/15 text-danger border border-danger/25"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active medications */}
      {active.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-glass-border">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Active Medications</div>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {active.map((med, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-bold text-ink break-words max-w-full">{med.name}</span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
                        {med.class}
                      </span>
                    </div>
                    <div className="text-[10px] text-dim mt-0.5 break-words">
                      {med.frequency} · Since {med.since} · Dr. {med.prescribedBy}
                    </div>
                    <div className="text-[10px] text-dim mt-0.5">Last taken: {med.lastTaken}</div>
                    {med.notes && (
                      <div className="text-[10px] text-warning mt-0.5 break-words">{med.notes}</div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={cn("text-[15px] font-bold", adherenceColor(med.adherence))}>
                      {med.adherence}%
                    </div>
                    <div className="text-[9px] text-dim">adherence</div>
                    <div className="text-[9px] text-dim mt-0.5">{med.missedLast30} missed/30d</div>
                  </div>
                </div>

                {/* Adherence dots — last 14 days */}
                {med.dots && med.dots.length > 0 && (
                  <div className="flex gap-0.5 mt-2" title="Last 14 days">
                    {med.dots.slice(-14).map((dot, di) => (
                      <div
                        key={di}
                        className={cn("w-3 h-3 rounded-sm flex-shrink-0", dotClass(dot))}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past medications */}
      {past.length > 0 && (
        <div className="glass-card overflow-hidden opacity-70">
          <div className="px-4 py-3 border-b border-glass-border">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Past Medications</div>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {past.map((med, i) => (
              <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-muted line-through break-words">{med.name}</span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-dim border border-white/10">
                      {med.class}
                    </span>
                  </div>
                  <div className="text-[10px] text-dim mt-0.5">
                    {med.from} — {med.to}
                  </div>
                </div>
                <div className="text-[10px] text-dim text-right w-[180px] flex-shrink-0 break-words">
                  {med.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

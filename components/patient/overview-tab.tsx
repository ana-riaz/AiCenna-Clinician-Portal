"use client";

import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { VITAL_META } from "@/lib/types";
import { cn, getTrendClass, getScoreClass } from "@/lib/utils";
import { DigitalTwinHologram } from "@/components/patient/digital-twin-hologram";
import { VitalsTrendChart } from "@/components/patient/vitals-trend-chart";
import { SummaryCard } from "@/components/patient/summary-card";
import { ScoreRing, diseaseRiskScore } from "@/components/patient/score-ring";

interface OverviewTabProps {
  patientId: string;
}

export function OverviewTab({ patientId }: OverviewTabProps) {
  const { switchTab } = useApp();
  const patient = patientData[patientId];

  if (!patient) return null;

  const demoRows = [
    { k: "Hospitalizations", v: patient.hospitalizations },
    {
      k: "Doctor Visits",
      v: patient.doctorVisits,
      cls: ["Monthly", "Compliant", "As needed"].includes(patient.doctorVisits) ? "text-success" : "text-warning",
    },
    {
      k: "Sleep Quality",
      v: patient.sleep,
      cls: ["Poor", "Fair"].includes(patient.sleep) ? "text-warning" : "text-success",
    },
    {
      k: "Caffeine",
      v: patient.caffeine,
      cls: patient.caffeine === "Daily" ? "text-warning" : "",
    },
    {
      k: "Alcohol",
      v: patient.alcohol,
      cls: ["Rarely", "None", "None known"].includes(patient.alcohol) ? "text-success" : "text-warning",
    },
    {
      k: "Nicotine",
      v: patient.nicotine,
      cls: patient.nicotine === "None" ? "text-success" : patient.nicotine === "Occasional" ? "" : "text-warning",
    },
  ];

  if (patient.gender === "female") {
    demoRows.push({ k: "Pregnant", v: "No", cls: "text-success" });
  }

  const scores = [
    { label: "BOS Score", value: patient.baselineScore, tone: "cyan" as const },
    { label: "Health Score", value: patient.healthScore, tone: "health" as const },
    { label: "Disease Score", value: diseaseRiskScore(patient.risk), tone: "risk" as const },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold text-ink">Live Vitals</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {scores.map((score, idx) => (
              <ScoreRing key={score.label} {...score} delay={idx * 120} />
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[9px] font-bold bg-success/10 text-success tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
            LIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {VITAL_META.filter((meta) => patient.vitals[meta.key]).map((meta) => {
          const vital = patient.vitals[meta.key];
          return (
            <div key={meta.key} className="glass-card min-h-[58px] px-2.5 py-2 flex flex-col justify-between min-w-0">
              <div className="flex items-start justify-between gap-1">
                <div className="text-[7.5px] font-bold text-dim uppercase tracking-wider leading-tight truncate">
                  {meta.label}
                </div>
                <span className={cn("w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0", getTrendClass(vital.tc).replace("text-", "bg-"))} />
              </div>
              <div>
                <div className={cn("font-mono text-[13px] font-bold leading-none tracking-tight truncate", getTrendClass(vital.tc))}>
                  {vital.val}
                </div>
                <div className="text-[7.5px] text-dim mt-0.5 truncate">{vital.unit || meta.unit}</div>
              </div>
            </div>
          );
        })}
      </div>

      <VitalsTrendChart patientId={patientId} />

      <div className="grid grid-cols-[240px_1fr] gap-3.5 items-stretch">
        <div className="flex flex-col items-center px-1 py-0">
          <div className="text-[10px] font-bold text-dim uppercase tracking-widest mb-0 text-center flex-shrink-0">
            Digital Twin
          </div>
          <div
            onClick={() => switchTab("twin")}
            className="flex-1 min-h-0 overflow-hidden flex items-start justify-center cursor-pointer transition-opacity hover:opacity-85"
            title="Open Digital Twin view"
          >
            <DigitalTwinHologram patientId={patientId} className="h-full w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-2 pb-1.5 border-b border-glass-border">
              Demographics
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
              <span className="text-dim">Health Score</span>
              <span className="font-semibold text-muted flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", getScoreClass(patient.healthScore).replace("text-", "bg-"))} />
                <strong className="text-white">{patient.healthScore}</strong>
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
              <span className="text-dim">Age</span>
              <span className="font-semibold text-muted">{patient.age} years</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
              <span className="text-dim">Gender</span>
              <span className="font-semibold text-muted capitalize">{patient.gender}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
              <span className="text-dim">Height</span>
              <span className="font-semibold text-muted">{patient.height}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
              <span className="text-dim">Weight</span>
              <span className="font-semibold text-muted">{patient.weight}</span>
            </div>
            <div className="flex justify-between items-center py-1 text-[10px]">
              <span className="text-dim">Blood Group</span>
              <span className="font-semibold text-muted">{patient.blood}</span>
            </div>
          </div>

          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-2 pb-1.5 border-b border-glass-border">
              Health Summary
            </div>
            {demoRows.map((row, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex justify-between items-center py-1 text-[10px]",
                  idx < demoRows.length - 1 && "border-b border-[rgba(255,255,255,0.06)]"
                )}
              >
                <span className="text-dim">{row.k}</span>
                <span className={cn("font-semibold text-muted", row.cls)}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-3">
      <div className="glass-card p-2">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1.5 pb-1 border-b border-glass-border">
            Clinical Profile
          </div>

          <div className="mb-1.5">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-0.5">Active Conditions</div>
            <div className="flex flex-wrap gap-0.5">
              {patient.conditions.map((c) => (
                <span key={c} className="py-0.5 px-1.5 rounded-full text-[8.5px] font-semibold tag-condition">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-1.5">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-0.5">Current Medications</div>
            <div className="flex flex-wrap gap-0.5">
              {patient.medications.map((m) => (
                <span key={m} className="py-0.5 px-1.5 rounded-full text-[8.5px] font-semibold tag-medication">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-0.5">
              Allergies &middot; Family Risk
            </div>
            <div className="flex flex-wrap gap-0.5">
              {patient.allergies.map((a) => (
                <span key={a} className="py-0.5 px-1.5 rounded-full text-[8.5px] font-semibold tag-allergy">
                  {a}
                </span>
              ))}
              {patient.familyRisk.map((r) => (
                <span key={r} className="py-0.5 px-1.5 rounded-full text-[8.5px] font-semibold tag-family">
                  {r}
                </span>
              ))}
            </div>
          </div>
      </div>

      <SummaryCard patientId={patientId} />
      </div>
    </div>
    </div>
  );
}

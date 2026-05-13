"use client";

import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { PatientTab } from "@/lib/types";
import { cn, getRiskClass, getAvatarClass, getScoreClass } from "@/lib/utils";
import { OverviewTab } from "@/components/patient/overview-tab";
import { DigitalTwinTab } from "@/components/patient/digital-twin-tab";
import { LabsTab } from "@/components/patient/labs-tab";
import { HistoryTab } from "@/components/patient/history-tab";
import { MedicationsTab } from "@/components/patient/medications-tab";
import { PrescriptionsTab } from "@/components/patient/prescriptions-tab";

interface PatientViewProps {
  patientId: string;
}

const tabs: { key: PatientTab; label: string }[] = [
  { key: "ov", label: "Overview" },
  { key: "twin", label: "Digital Twin" },
  { key: "labs", label: "Lab Reports" },
  { key: "hist", label: "History" },
  { key: "meds", label: "Medications" },
  { key: "rx", label: "Prescriptions" },
];

function diseaseRiskScore(risk: string) {
  if (risk === "cr") return 92;
  if (risk === "hi") return 76;
  if (risk === "me") return 58;
  if (risk === "st") return 28;
  return 18;
}

function ScoreRing({
  label,
  value,
  tone,
  delay = 0,
}: {
  label: string;
  value: number;
  tone: "cyan" | "health" | "risk";
  delay?: number;
}) {
  const circumference = 87.96;
  const fill = ((Math.max(0, Math.min(100, value)) / 100) * circumference).toFixed(2);
  const toneClass =
    tone === "risk"
      ? value >= 80
        ? "text-danger"
        : value >= 55
          ? "text-warning"
          : "text-success"
      : tone === "health"
        ? getScoreClass(value)
        : "text-cyan";
  const stroke = tone === "risk" ? "var(--danger)" : tone === "health" ? "currentColor" : "var(--cyan)";

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-10 w-10 flex-shrink-0">
        <svg viewBox="0 0 36 36" className={cn("h-10 w-10 -rotate-90", toneClass)}>
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.2" />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={stroke}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circumference}`}
            className="animate-ring-in"
            style={{ animationDelay: `${delay}ms` }}
          />
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center text-[10px] font-black font-mono", toneClass)}>
          {value}
        </div>
      </div>
      <div className="min-w-[54px]">
        <div className="text-[8px] font-bold uppercase tracking-widest text-dim leading-tight">{label}</div>
        <div className="text-[8px] text-dim font-mono">/100</div>
      </div>
    </div>
  );
}

export function PatientView({ patientId }: PatientViewProps) {
  const { currentTab, switchTab } = useApp();
  const patient = patientData[patientId];

  if (!patient) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        Patient not found
      </div>
    );
  }

  const scores = [
    { label: "BOS", value: patient.baselineScore, tone: "cyan" as const },
    { label: "Health", value: patient.healthScore, tone: "health" as const },
    { label: "Disease Risk", value: diseaseRiskScore(patient.risk), tone: "risk" as const },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Patient Header */}
      <div className="bg-[rgba(8,18,37,0.7)] backdrop-blur-[20px] border-b border-glass-border px-6 flex items-center gap-4 flex-shrink-0">
        {/* Patient Info */}
        <div className="flex items-center gap-3 py-2.5">
          <div
            className={cn(
              "w-[38px] h-[38px] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
              getAvatarClass(patient.risk)
            )}
          >
            {patient.init}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-ink leading-tight">{patient.name}</div>
            <span
              className={cn(
                "inline-block mt-0.5 py-0.5 px-2 rounded-full text-[9px] font-bold tracking-wide",
                getRiskClass(patient.risk)
              )}
            >
              {patient.rl}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-glass-border flex-shrink-0" />

        {/* Score Rings */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {scores.map((score, idx) => (
            <ScoreRing key={score.label} {...score} delay={idx * 120} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 ml-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={cn(
                "py-4 px-4 text-[11px] font-semibold text-muted cursor-pointer border-b-2 border-transparent transition-all whitespace-nowrap",
                "hover:text-ink",
                currentTab === tab.key && "text-[#38bdf8] border-b-[#38bdf8]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {currentTab === "ov" && <OverviewTab patientId={patientId} />}
        {currentTab === "twin" && <DigitalTwinTab patientId={patientId} />}
        {currentTab === "labs" && <LabsTab patientId={patientId} />}
        {currentTab === "hist" && <HistoryTab patientId={patientId} />}
        {currentTab === "meds" && <MedicationsTab patientId={patientId} />}
        {currentTab === "rx" && <PrescriptionsTab patientId={patientId} />}
      </div>
    </div>
  );
}

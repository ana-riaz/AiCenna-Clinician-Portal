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

interface PatientViewProps {
  patientId: string;
}

const tabs: { key: PatientTab; label: string }[] = [
  { key: "ov", label: "Overview" },
  { key: "twin", label: "Digital Twin" },
  { key: "labs", label: "Lab Reports" },
  { key: "hist", label: "History" },
  { key: "meds", label: "Medications" },
];

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

  const scoreClass = getScoreClass(patient.healthScore);
  const fillPercent = ((patient.healthScore / 100) * 87.96).toFixed(2);

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

        {/* Health Score */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <div className="text-[9px] text-dim uppercase tracking-widest">Health Score</div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn("text-[22px] font-black font-mono leading-none", scoreClass)}>
              {patient.healthScore}
            </span>
            <span className="text-[10px] text-dim">/100</span>
          </div>
          <div className="w-24 h-1.5 rounded-full bg-white/10">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                patient.healthScore >= 80 ? "bg-success"
                  : patient.healthScore >= 60 ? "bg-warning"
                  : "bg-danger"
              )}
              style={{ width: `${patient.healthScore}%` }}
            />
          </div>
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
      </div>
    </div>
  );
}

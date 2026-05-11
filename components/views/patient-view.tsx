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
      <div className="bg-[rgba(8,18,37,0.7)] backdrop-blur-[20px] border-b border-glass-border px-6 flex items-center gap-0 flex-shrink-0">
        {/* Patient Info */}
        <div className="flex items-center gap-3 py-2.5 flex-1">
          <div
            className={cn(
              "w-[38px] h-[38px] rounded-full flex items-center justify-center text-sm font-bold",
              getAvatarClass(patient.risk)
            )}
          >
            {patient.init}
          </div>
          <div>
            <div className="text-[10px] text-muted mt-0.5">{patient.meta}</div>
          </div>
          <span
            className={cn(
              "py-0.5 px-2.5 rounded-full text-[9px] font-bold tracking-wide ml-2",
              getRiskClass(patient.risk)
            )}
          >
            {patient.rl}
          </span>

          {/* Health Score Ring */}
          <div className="relative w-10 h-10 flex-shrink-0 ml-2.5">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${fillPercent} 87.96`}
                className={cn(
                  "transition-all duration-700",
                  patient.healthScore >= 80
                    ? "stroke-success"
                    : patient.healthScore >= 60
                    ? "stroke-warning"
                    : "stroke-danger"
                )}
              />
            </svg>
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center text-[10px] font-extrabold font-mono",
                scoreClass
              )}
            >
              {patient.healthScore}
            </span>
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
      <div className="flex-1 overflow-hidden">
        {currentTab === "ov" && <OverviewTab patientId={patientId} />}
        {currentTab === "twin" && <DigitalTwinTab patientId={patientId} />}
        {currentTab === "labs" && <LabsTab patientId={patientId} />}
        {currentTab === "hist" && <HistoryTab patientId={patientId} />}
        {currentTab === "meds" && <MedicationsTab patientId={patientId} />}
      </div>
    </div>
  );
}

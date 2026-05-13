"use client";

import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { PatientTab } from "@/lib/types";
import { cn, getRiskClass, getAvatarClass } from "@/lib/utils";
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

export function PatientHeaderControls({ patientId }: PatientViewProps) {
  const { currentTab, switchTab } = useApp();
  const patient = patientData[patientId];

  if (!patient) return null;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex items-center gap-2.5 min-w-[150px]">
        <div
          className={cn(
            "w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
            getAvatarClass(patient.risk)
          )}
        >
          {patient.init}
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-bold text-ink leading-tight truncate">{patient.name}</div>
          <span
            className={cn(
              "inline-block mt-0.5 py-0.5 px-2 rounded-full text-[8px] font-bold tracking-wide",
              getRiskClass(patient.risk)
            )}
          >
            {patient.rl}
          </span>
        </div>
      </div>

      <div className="w-px h-8 bg-glass-border flex-shrink-0" />

      <div className="flex gap-0 min-w-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={cn(
              "h-[58px] px-3 text-[10px] font-semibold text-muted cursor-pointer border-b-2 border-transparent transition-all whitespace-nowrap",
              "hover:text-ink",
              currentTab === tab.key && "text-[#38bdf8] border-b-[#38bdf8]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PatientView({ patientId }: PatientViewProps) {
  const { currentTab } = useApp();
  const patient = patientData[patientId];

  if (!patient) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        Patient not found
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
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

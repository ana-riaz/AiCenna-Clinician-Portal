"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { VITAL_META, OV_VITALS, VitalFilter, AI_SUGGESTIONS } from "@/lib/types";
import { cn, getTrendClass, getScoreClass } from "@/lib/utils";
import { DigitalTwinSvg } from "@/components/patient/digital-twin-svg";
import { VitalsGrid } from "@/components/patient/vitals-grid";
import { SummaryCard } from "@/components/patient/summary-card";

interface OverviewTabProps {
  patientId: string;
}

export function OverviewTab({ patientId }: OverviewTabProps) {
  const { vitalFilter, setVitalFilter, switchTab } = useApp();
  const patient = patientData[patientId];

  if (!patient) return null;

  const filters: VitalFilter[] = ["24h", "7d", "15d", "30d"];

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

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-5 flex flex-col gap-3">
      {/* Vital Filter Bar */}
      <div className="flex gap-1 mb-2.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setVitalFilter(f)}
            className={cn(
              "py-1 px-2.5 rounded-[7px] text-[10px] font-bold cursor-pointer border border-glass-border bg-glass-strong text-muted transition-all",
              "hover:text-ink",
              vitalFilter === f &&
                "bg-gradient-to-br from-[rgba(56,189,248,0.18)] to-[rgba(139,92,246,0.18)] text-ink border-[rgba(56,189,248,0.35)]"
            )}
          >
            {f}
          </button>
        ))}
        <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[9px] font-bold bg-success/10 text-success tracking-wider ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
          LIVE
        </span>
      </div>

      {/* Main Grid: Twin + Vitals */}
      <div className="grid grid-cols-[315px_1fr] gap-3.5 items-stretch">
        {/* Digital Twin */}
        <div className="flex flex-col items-center px-4">
          <div className="text-[10px] font-bold text-dim uppercase tracking-widest mb-1 text-center flex-shrink-0">
            Digital Twin
          </div>
          <div
            onClick={() => switchTab("twin")}
            className="flex-1 min-h-0 overflow-hidden flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85"
            title="Open Digital Twin view"
          >
            <DigitalTwinSvg patientId={patientId} className="h-full max-h-[400px] w-auto" />
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="flex flex-col gap-3">
          <VitalsGrid patientId={patientId} filter={vitalFilter} />
        </div>
      </div>

      {/* Bottom Cards: Demographics, Health Summary, Clinical Profile */}
      <div className="grid grid-cols-3 gap-3">
        {/* Demographics */}
        <div className="glass-card p-4">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-3 pb-2 border-b border-glass-border">
            Demographics
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
            <span className="text-dim">Health Score</span>
            <span className="font-semibold text-muted flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", getScoreClass(patient.healthScore).replace("text-", "bg-"))} />
              <strong className="text-white">{patient.healthScore}</strong>
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
            <span className="text-dim">Age</span>
            <span className="font-semibold text-muted">{patient.age} years</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
            <span className="text-dim">Gender</span>
            <span className="font-semibold text-muted capitalize">{patient.gender}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
            <span className="text-dim">Height</span>
            <span className="font-semibold text-muted">{patient.height}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-[rgba(255,255,255,0.06)] text-[10px]">
            <span className="text-dim">Weight</span>
            <span className="font-semibold text-muted">{patient.weight}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 text-[10px]">
            <span className="text-dim">Blood Group</span>
            <span className="font-semibold text-muted">{patient.blood}</span>
          </div>
        </div>

        {/* Health Summary */}
        <div className="glass-card p-4">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-3 pb-2 border-b border-glass-border">
            Health Summary
          </div>
          {demoRows.map((row, idx) => (
            <div
              key={idx}
              className={cn(
                "flex justify-between items-center py-1.5 text-[10px]",
                idx < demoRows.length - 1 && "border-b border-[rgba(255,255,255,0.06)]"
              )}
            >
              <span className="text-dim">{row.k}</span>
              <span className={cn("font-semibold text-muted", row.cls)}>{row.v}</span>
            </div>
          ))}
        </div>

        {/* Clinical Profile */}
        <div className="glass-card p-4">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-3 pb-2 border-b border-glass-border">
            Clinical Profile
          </div>

          <div className="mb-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1.5">Active Conditions</div>
            <div className="flex flex-wrap gap-1.5">
              {patient.conditions.map((c) => (
                <span key={c} className="py-0.5 px-2.5 rounded-full text-[10px] font-semibold tag-condition">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1.5">Current Medications</div>
            <div className="flex flex-wrap gap-1.5">
              {patient.medications.map((m) => (
                <span key={m} className="py-0.5 px-2.5 rounded-full text-[10px] font-semibold tag-medication">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1.5">
              Allergies &middot; Family Risk
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.map((a) => (
                <span key={a} className="py-0.5 px-2.5 rounded-full text-[10px] font-semibold tag-allergy">
                  {a}
                </span>
              ))}
              {patient.familyRisk.map((r) => (
                <span key={r} className="py-0.5 px-2.5 rounded-full text-[10px] font-semibold tag-family">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <SummaryCard patientId={patientId} />
    </div>
    </div>
  );
}

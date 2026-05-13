"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { patientData, getAllPatients } from "@/lib/data/patients";
import { RISK_ORDER } from "@/lib/types";
import { cn, getRiskClass, getAvatarClass } from "@/lib/utils";
import { Users, Star, FlaskConical, Bell, ChevronDown } from "lucide-react";

type DashFilter = "all" | "critical" | "high" | "medium" | "low";
type DashSort = "risk" | "name" | "age";

const riskMap: Record<string, string> = {
  critical: "cr",
  high: "hi",
  medium: "me",
  low: "st",
};

export function DashboardView() {
  const { alerts, openPatient, showPatients, showAlerts, showLabs } = useApp();
  const [filter, setFilter] = useState<DashFilter>("all");
  const [sort, setSort] = useState<DashSort>("risk");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const patients = getAllPatients();
  const summariesPending = alerts.filter((a) => a.type === "summary" && !a.read).length;
  const activeAlerts = alerts.filter((a) => !a.read && a.panel).length;
  const labFlaggedCount = patients.filter((p) => {
    const byName = new Map<string, (typeof p.labs)[0]>();
    for (const lab of p.labs) {
      const d = new Date(lab.date.split("·")[0].trim());
      const prev = byName.get(lab.name);
      if (!prev || d > new Date(prev.date.split("·")[0].trim())) byName.set(lab.name, lab);
    }
    return Array.from(byName.values()).some((lab) => lab.rows.some((r) => r.flag === "CRITICAL"));
  }).length;

  // Filter and sort patients
  const filteredPatients = patients
    .filter((p) => {
      if (filter === "all") return true;
      const riskCode = riskMap[filter];
      return p.risk === riskCode || (filter === "low" && p.risk === "lo");
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "age") return a.age - b.age;
      return (RISK_ORDER[a.risk] ?? 4) - (RISK_ORDER[b.risk] ?? 4);
    });

  const getVitalDisplay = (patient: (typeof patients)[0]) => {
    const v = patient.vitals;
    if (v.spo2?.tc === "c") return { text: `SpO2 ${v.spo2.val}%`, highlight: true };
    if (v.hr?.tc === "c") return { text: `HR ${v.hr.val} bpm`, highlight: true };
    if (v.bp?.tc === "c") return { text: `BP ${v.bp.val}`, highlight: true };
    if (v.glucose?.tc === "c") return { text: `Glucose ${v.glucose.val}`, highlight: true };
    if (v.spo2?.tc === "e") return { text: `SpO2 ${v.spo2.val}%`, highlight: true };
    if (v.hr?.tc === "e") return { text: `HR ${v.hr.val} bpm`, highlight: true };
    return { text: `HR ${v.hr?.val || "--"} · SpO2 ${v.spo2?.val || "--"}%`, highlight: false };
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={showPatients}
          className="glass-card relative overflow-hidden p-4 cursor-pointer transition-all hover:border-glass-strong hover:-translate-y-0.5 group"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[18px] bg-gradient-to-r from-[#38BDF8] to-cyan" />
          <div className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-[10px] bg-[rgba(56,189,248,0.12)] text-[#38BDF8] flex items-center justify-center">
            <Users size={16} />
          </div>
          <div className="text-[10px] text-muted font-semibold mb-2 uppercase tracking-wide">
            Total Patients
          </div>
          <div className="text-2xl font-extrabold tracking-tight">{patients.length}</div>
          <div className="text-[10px] text-dim mt-1">
            <span className="text-success">All monitored</span>
          </div>
        </button>

        <button
          onClick={showPatients}
          className="glass-card relative overflow-hidden p-4 cursor-pointer transition-all hover:border-glass-strong hover:-translate-y-0.5"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[18px] bg-gradient-to-r from-violet to-rose" />
          <div className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-[10px] bg-[rgba(139,92,246,0.12)] text-violet flex items-center justify-center">
            <Star size={16} />
          </div>
          <div className="text-[10px] text-muted font-semibold mb-2 uppercase tracking-wide">
            Summaries Pending
          </div>
          <div className="text-2xl font-extrabold tracking-tight">
            {summariesPending || "—"}
          </div>
          <div className="text-[10px] text-dim mt-1">Awaiting verification</div>
        </button>

        <button
          onClick={showLabs}
          className="glass-card relative overflow-hidden p-4 cursor-pointer transition-all hover:border-glass-strong hover:-translate-y-0.5"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[18px] bg-gradient-to-r from-warning to-rose" />
          <div className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-[10px] bg-[rgba(251,191,36,0.12)] text-warning flex items-center justify-center">
            <FlaskConical size={16} />
          </div>
          <div className="text-[10px] text-muted font-semibold mb-2 uppercase tracking-wide">
            Lab Reports
          </div>
          <div className="text-2xl font-extrabold tracking-tight">{labFlaggedCount}</div>
          <div className="text-[10px] text-dim mt-1">
            <span className={labFlaggedCount > 0 ? "text-danger" : "text-success"}>
              {labFlaggedCount > 0
                ? `${labFlaggedCount} patient${labFlaggedCount !== 1 ? "s" : ""} flagged`
                : "All clear"}
            </span>
          </div>
        </button>

        <button
          onClick={showAlerts}
          className="glass-card relative overflow-hidden p-4 cursor-pointer transition-all hover:border-glass-strong hover:-translate-y-0.5"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[18px] bg-gradient-to-r from-danger to-rose" />
          <div className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-[10px] bg-[rgba(251,113,133,0.12)] text-danger flex items-center justify-center">
            <Bell size={16} />
          </div>
          <div className="text-[10px] text-muted font-semibold mb-2 uppercase tracking-wide">
            Active Alerts
          </div>
          <div className="text-2xl font-extrabold tracking-tight">{activeAlerts}</div>
          <div className="text-[10px] text-dim mt-1">
            <span className="text-danger">Needs attention</span>
          </div>
        </button>
      </div>

      {/* Patient List Panel */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <div className="text-[13px] font-bold">My Patients</div>

          <div className="flex items-center gap-1.5 flex-1 justify-center">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setFilterOpen(!filterOpen);
                  setSortOpen(false);
                }}
                className="flex items-center gap-1.5 py-2 px-3.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg text-muted text-xs font-medium cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.08)]"
              >
                <span className="text-dim text-[10px]">Filter</span>
                <span className="capitalize">{filter === "all" ? "All" : filter}</span>
                <ChevronDown size={10} />
              </button>
              {filterOpen && (
                <div className="absolute top-full mt-1 left-0 bg-[rgba(8,18,37,0.98)] border border-glass-border rounded-lg py-1 z-50 min-w-[120px]">
                  {(["all", "critical", "high", "medium", "low"] as DashFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFilter(f);
                        setFilterOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs hover:bg-glass transition-colors capitalize",
                        filter === f && "text-[#38bdf8] bg-[rgba(56,189,248,0.1)]"
                      )}
                    >
                      {f === "all" ? "All" : f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setFilterOpen(false);
                }}
                className="flex items-center gap-1.5 py-2 px-3.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg text-muted text-xs font-medium cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.08)]"
              >
                <span className="text-dim text-[10px]">Sort</span>
                <span className="capitalize">{sort}</span>
                <ChevronDown size={10} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-1 left-0 bg-[rgba(8,18,37,0.98)] border border-glass-border rounded-lg py-1 z-50 min-w-[100px]">
                  {(["risk", "name", "age"] as DashSort[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSort(s);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs hover:bg-glass transition-colors capitalize",
                        sort === s && "text-[#38bdf8] bg-[rgba(56,189,248,0.1)]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={showPatients}
            className="text-[11px] text-[#38bdf8] cursor-pointer font-medium hover:underline"
          >
            View all &rarr;
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_90px] gap-2 py-2.5 px-4 text-[9px] font-bold text-dim uppercase tracking-wider border-b border-glass-border">
          <span>Patient</span>
          <span>Risk</span>
          <span>Last Vital</span>
          <span>Action</span>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
          {filteredPatients.map((patient) => {
            const vitalDisplay = getVitalDisplay(patient);
            return (
              <button
                key={patient.id}
                onClick={() => openPatient(patient.id, "ov", "dash")}
                className="group w-full grid grid-cols-[2fr_1fr_1fr_90px] gap-2 py-3 px-4 items-center cursor-pointer transition-colors border-b border-[rgba(255,255,255,0.04)] last:border-b-0 hover:bg-glass text-left"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                      getAvatarClass(patient.risk)
                    )}
                  >
                    {patient.init}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{patient.name}</div>
                    <div className="text-[10px] text-muted mt-0.5">
                      {patient.conditions.slice(0, 2).join(" · ")}
                    </div>
                  </div>
                </div>

                {/* Risk Badge */}
                <div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[9px] font-bold tracking-wide",
                      getRiskClass(patient.risk)
                    )}
                  >
                    {patient.rl}
                  </span>
                </div>

                {/* Vital */}
                <div className="font-mono text-[11px] text-muted">
                  <span className={cn(vitalDisplay.highlight && "text-warning")}>
                    {vitalDisplay.text}
                  </span>
                </div>

                {/* Action */}
                <div className="py-1.5 px-3 bg-glass-strong border border-glass-border rounded-lg text-muted text-[10px] font-semibold transition-all group-hover:bg-[rgba(56,189,248,0.15)] group-hover:border-[#38bdf8] group-hover:text-[#38bdf8] text-center">
                  Open &rarr;
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

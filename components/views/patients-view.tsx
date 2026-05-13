"use client";

import { useApp } from "@/lib/context/app-context";
import { getAllPatients } from "@/lib/data/patients";
import { RISK_ORDER, RiskFilter, SortOption } from "@/lib/types";
import { cn, getRiskClass, getAvatarClass, getScoreClass } from "@/lib/utils";

const riskMap: Record<string, string> = {
  critical: "cr",
  high: "hi",
  medium: "me",
  low: "st",
};

export function PatientsView() {
  const {
    searchQuery,
    riskFilter,
    sortOption,
    setRiskFilter,
    setSortOption,
    openPatient,
  } = useApp();

  const patients = getAllPatients();

  // Filter patients
  const filteredPatients = patients
    .filter((p) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesRisk = p.rl.toLowerCase().includes(q);
        const matchesCondition = p.conditions.some((c) =>
          c.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesRisk && !matchesCondition) return false;
      }
      // Risk filter
      if (riskFilter !== "all") {
        const riskCode = riskMap[riskFilter];
        if (p.risk !== riskCode && !(riskFilter === "low" && p.risk === "lo")) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "age") return a.age - b.age;
      return (RISK_ORDER[a.risk] ?? 4) - (RISK_ORDER[b.risk] ?? 4);
    });

  const filters: RiskFilter[] = ["all", "critical", "high", "medium", "low"];
  const sorts: { key: SortOption; label: string }[] = [
    { key: "risk", label: "Risk" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
  ];

  const getVitalColor = (tc: string) => {
    if (tc === "c") return "text-danger";
    if (tc === "e") return "text-warning";
    return "text-success";
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">


      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter buttons */}
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              className={cn(
                "py-1.5 px-3.5 rounded-full text-[10px] font-bold cursor-pointer border border-glass-border bg-glass text-muted transition-all capitalize",
                "hover:text-ink",
                riskFilter === f &&
                  "bg-[rgba(56,189,248,0.15)] text-[#38bdf8] border-[rgba(56,189,248,0.35)]"
              )}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-dim font-semibold mr-1">Sort by</span>
          {sorts.map((s) => (
            <button
              key={s.key}
              onClick={() => setSortOption(s.key)}
              className={cn(
                "py-1.5 px-2.5 rounded-lg text-[10px] font-semibold cursor-pointer border border-glass-border bg-transparent text-muted transition-all",
                "hover:text-ink",
                sortOption === s.key && "bg-glass-strong text-ink"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards */}
      <div className="flex flex-col gap-3">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-10 text-dim text-xs">
            No patients match this filter.
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const v = patient.vitals;
            const healthClass = getScoreClass(patient.healthScore);
            const baselineClass = getScoreClass(patient.baselineScore);

            return (
              <button
                key={patient.id}
                onClick={() => openPatient(patient.id, "ov", "patients")}
                className="glass-card cursor-pointer text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-glass-border">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                        getAvatarClass(patient.risk)
                      )}
                    >
                      {patient.init}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold">{patient.name}</div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {patient.meta}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "py-0.5 px-2.5 rounded-full text-[9px] font-bold tracking-wide",
                        getRiskClass(patient.risk)
                      )}
                    >
                      {patient.rl}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openPatient(patient.id, "ov", "patients");
                      }}
                      className="py-1.5 px-2.5 text-[11px] font-semibold bg-glass-strong border border-glass-border rounded-lg text-muted hover:bg-[rgba(56,189,248,0.15)] hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all cursor-pointer"
                    >
                      Preview
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div className="flex items-center gap-0 py-2.5 px-4 border-t border-glass-border bg-[rgba(255,255,255,0.02)]">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-dim uppercase tracking-wider">
                      Health Score
                    </span>
                    <span className={cn("font-mono text-lg font-bold leading-none", healthClass)}>
                      {patient.healthScore}
                      <span className="text-[10px] text-dim font-normal ml-0.5">/100</span>
                    </span>
                  </div>
                  <div className="w-px h-9 bg-glass-border mx-4" />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-dim uppercase tracking-wider flex items-center gap-1">
                      Baseline Score
                      <span className="text-[8px] py-0.5 px-1.5 rounded bg-[rgba(139,92,246,0.12)] text-violet font-semibold normal-case tracking-normal">
                        onboarding API
                      </span>
                    </span>
                    <span className={cn("font-mono text-lg font-bold leading-none", baselineClass)}>
                      {patient.baselineScore}
                      <span className="text-[10px] text-dim font-normal ml-0.5">/100</span>
                    </span>
                  </div>
                </div>

                {/* Vitals Strip */}
                <div className="flex gap-2.5 py-2.5 px-4 border-t border-glass-border">
                  {[
                    { label: "Heart Rate", val: v.hr?.val, unit: "bpm", tc: v.hr?.tc },
                    { label: "SpO2", val: v.spo2?.val, unit: "%", tc: v.spo2?.tc },
                    { label: "Blood Pressure", val: v.bp?.val, unit: "", tc: v.bp?.tc },
                  ].map((vital) => (
                    <div
                      key={vital.label}
                      className="flex-1 text-center py-2 px-2.5 bg-[rgba(255,255,255,0.04)] rounded-lg"
                    >
                      <div className="text-[9px] text-dim font-bold uppercase tracking-wider mb-1">
                        {vital.label}
                      </div>
                      <div className={cn("font-mono text-base font-medium", getVitalColor(vital.tc || "n"))}>
                        {vital.val}
                        <span className="text-[9px] text-dim ml-0.5">{vital.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags Strip */}
                <div className="flex flex-wrap gap-1.5 py-1.5 px-4 pb-3">
                  {patient.conditions.map((c) => (
                    <span key={c} className="py-0.5 px-2.5 rounded-full text-[10px] font-semibold tag-condition">
                      {c}
                    </span>
                  ))}
                  {patient.medications.map((m) => (
                    <span key={m} className="py-0.5 px-2.5 rounded-full text-[10px] font-semibold tag-medication">
                      {m}
                    </span>
                  ))}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

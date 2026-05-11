"use client";

import { useApp } from "@/lib/context/app-context";
import { getAllPatients } from "@/lib/data/patients";
import { cn, getRiskClass, getAvatarClass } from "@/lib/utils";

function getFlagClass(flag: string) {
  if (flag === "CRITICAL") return "bg-danger/15 text-danger";
  if (flag === "HIGH") return "bg-warning/15 text-warning";
  return "bg-success/8 text-success";
}

function getValueClass(flag: string) {
  if (flag === "CRITICAL") return "text-danger";
  if (flag === "HIGH") return "text-warning";
  return "text-muted";
}

export function LabsView() {
  const { openPatient } = useApp();
  const patients = getAllPatients();

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* Title */}
      <div>
        <div className="text-[15px] font-extrabold tracking-tight mb-1">Lab Reports</div>
        <div className="text-[11px] text-muted">
          All patient lab results &mdash; click a row for the full report
        </div>
      </div>

      {/* Patient Lab Cards */}
      <div className="flex flex-col gap-3.5">
        {patients.map((patient) => {
          const totalFlagged = patient.labs.reduce(
            (n, lab) => n + lab.rows.filter((r) => r.flag !== "NORMAL").length,
            0
          );
          const flagCountClass =
            totalFlagged > 2 ? "text-danger" : totalFlagged > 0 ? "text-warning" : "text-success";

          return (
            <div key={patient.id} className="glass-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-glass-border">
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
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold", flagCountClass)}>
                    {totalFlagged} flagged
                  </span>
                  <button
                    onClick={() => openPatient(patient.id, "labs", "labs")}
                    className="py-1.5 px-3 bg-glass-strong border border-glass-border rounded-lg text-muted text-[10px] cursor-pointer font-semibold transition-all hover:bg-[rgba(56,189,248,0.15)] hover:border-[#38bdf8] hover:text-[#38bdf8]"
                  >
                    Open &rarr;
                  </button>
                </div>
              </div>

              {/* Lab Panels */}
              {patient.labs.map((lab, labIdx) => (
                <div key={labIdx} className="border-t border-glass-border p-4 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[11px] font-bold text-ink">{lab.name}</div>
                      <div className="text-[10px] text-muted mt-0.5">{lab.date}</div>
                    </div>
                    <span
                      className={cn(
                        "py-0.5 px-2 rounded-full text-[9px] font-bold",
                        lab.statusCls === "f"
                          ? "bg-warning/15 text-warning"
                          : "bg-success/12 text-success"
                      )}
                    >
                      {lab.status}
                    </span>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-[2fr_1fr_1.5fr_70px_auto] gap-2 py-1.5 text-[9px] font-bold text-dim uppercase tracking-wider border-b border-glass-border">
                    <span>Test</span>
                    <span>Value</span>
                    <span>Reference</span>
                    <span>Status</span>
                    <span></span>
                  </div>

                  {/* Table Rows */}
                  {lab.rows.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="grid grid-cols-[2fr_1fr_1.5fr_70px_auto] gap-2 py-2 text-[11px] border-b border-[rgba(255,255,255,0.04)] last:border-b-0 items-center"
                    >
                      <span className="text-muted">{row.test}</span>
                      <span className={cn("font-mono text-xs", getValueClass(row.flag))}>
                        {row.val}
                      </span>
                      <span className="text-dim text-[10px]">{row.ref}</span>
                      <span
                        className={cn("py-0.5 px-1.5 rounded text-[9px] font-bold", getFlagClass(row.flag))}
                      >
                        {row.flag}
                      </span>
                      <button
                        onClick={() => openPatient(patient.id, "labs", "labs")}
                        className="py-1 px-2 bg-glass-strong border border-glass-border rounded text-muted text-[9px] cursor-pointer font-semibold transition-all hover:bg-[rgba(56,189,248,0.15)] hover:border-[#38bdf8] hover:text-[#38bdf8]"
                      >
                        View Report
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

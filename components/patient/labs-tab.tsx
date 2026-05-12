"use client";

import { patientData } from "@/lib/data/patients";
import { LabRow } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LabsTabProps {
  patientId: string;
}

const FLAG_COLOR: Record<LabRow["flag"], string> = {
  CRITICAL: "text-danger",
  HIGH: "text-warning",
  NORMAL: "text-success",
};

const FLAG_BADGE: Record<LabRow["flag"], string> = {
  CRITICAL: "bg-danger/10 text-danger border-danger/25",
  HIGH: "bg-warning/10 text-warning border-warning/25",
  NORMAL: "bg-success/10 text-success border-success/25",
};

export function LabsTab({ patientId }: LabsTabProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  const totalTests = patient.labs.reduce((n, l) => n + l.rows.length, 0);
  const totalFlagged = patient.labs.reduce(
    (n, l) => n + l.rows.filter((r) => r.flag !== "NORMAL").length,
    0
  );
  const criticalCount = patient.labs.reduce(
    (n, l) => n + l.rows.filter((r) => r.flag === "CRITICAL").length,
    0
  );

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-5 flex flex-col gap-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Lab Panels</div>
          <div className="text-xl font-bold text-ink">{patient.labs.length}</div>
        </div>
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Total Tests</div>
          <div className="text-xl font-bold text-ink">{totalTests}</div>
        </div>
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Flagged</div>
          <div className={cn("text-xl font-bold", totalFlagged > 0 ? "text-warning" : "text-success")}>
            {totalFlagged}
          </div>
        </div>
        <div className="glass-card p-3">
          <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Critical</div>
          <div className={cn("text-xl font-bold", criticalCount > 0 ? "text-danger" : "text-success")}>
            {criticalCount}
          </div>
        </div>
      </div>

      {/* Lab panels */}
      {patient.labs.map((lab, li) => (
        <div key={li} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-glass-border">
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-ink truncate">{lab.name}</div>
              <div className="text-[10px] text-dim mt-0.5 truncate">{lab.date}</div>
            </div>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[9px] font-bold border",
                lab.statusCls === "ok"
                  ? "bg-success/10 text-success border-success/25"
                  : "bg-danger/10 text-danger border-danger/25"
              )}
            >
              {lab.status}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] table-fixed">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left px-4 py-2 text-[9px] font-bold text-dim uppercase tracking-wider w-[40%]">
                    Test
                  </th>
                  <th className="text-left px-4 py-2 text-[9px] font-bold text-dim uppercase tracking-wider w-[20%]">
                    Value
                  </th>
                  <th className="text-left px-4 py-2 text-[9px] font-bold text-dim uppercase tracking-wider w-[25%]">
                    Reference
                  </th>
                  <th className="text-left px-4 py-2 text-[9px] font-bold text-dim uppercase tracking-wider w-[15%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {lab.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-2.5 text-muted max-w-0">
                      <div className="truncate" title={row.test}>{row.test}</div>
                    </td>
                    <td className={cn("px-4 py-2.5 font-mono font-semibold max-w-0", FLAG_COLOR[row.flag])}>
                      <div className="truncate">{row.val}</div>
                    </td>
                    <td className="px-4 py-2.5 text-dim font-mono max-w-0">
                      <div className="truncate">{row.ref}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap",
                          FLAG_BADGE[row.flag]
                        )}
                      >
                        {row.flag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

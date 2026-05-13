"use client";

import { patientData } from "@/lib/data/patients";
import { VITAL_META, OV_VITALS, VitalFilter } from "@/lib/types";
import { cn, getTrendClass } from "@/lib/utils";
import { Sparkline } from "@/components/patient/sparkline";

interface VitalsGridProps {
  patientId: string;
  filter: VitalFilter;
}

function getFilterSlice(history: { daily: number[]; hourly: number[] }, filter: VitalFilter): number[] {
  if (filter === "24h") return history.hourly;
  if (filter === "7d") return history.daily.slice(-7);
  if (filter === "15d") return history.daily.slice(-15);
  return history.daily; // 30d
}

function computeTrend(values: number[], unit: string, filter: VitalFilter): string {
  if (!values || values.length < 2) return "→ No data";
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  if (Math.abs(delta / Math.max(Math.abs(first), 1)) * 100 < 2) return "→ Stable";
  const labels: Record<VitalFilter, string> = { "24h": "24h", "7d": "7d", "15d": "15d", "30d": "30d" };
  return `${delta > 0 ? "↑" : "↓"} ${delta > 0 ? "+" : ""}${Math.round(delta)} ${unit} / ${labels[filter]}`;
}

export function VitalsGrid({ patientId, filter }: VitalsGridProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  const periodLabel: Record<VitalFilter, string> = {
    "24h": "current",
    "7d": "7d avg",
    "15d": "15d avg",
    "30d": "30d avg",
  };

  const xStart: Record<VitalFilter, string> = {
    "24h": "24h ago",
    "7d": "7d ago",
    "15d": "15d ago",
    "30d": "30d ago",
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {VITAL_META.filter((m) => OV_VITALS.includes(m.key)).map((meta) => {
        const vital = patient.vitals[meta.key];
        const history = patient.vitalHistory[meta.key];

        if (!vital || !history) {
          return (
            <div key={meta.key} className="glass-card p-2.5 min-h-[120px]">
              <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1.5 flex items-center justify-between">
                {meta.label}
                <span className="text-[8px] py-0.5 px-1.5 rounded bg-glass-strong text-dim normal-case tracking-normal">
                  {meta.src}
                </span>
              </div>
              <div className="text-[19px] font-mono font-medium text-dim leading-none">—</div>
              <div className="text-[9px] text-success mt-0.5">No data available</div>
            </div>
          );
        }

        const sparkValues = getFilterSlice(history, filter);
        const trendText = computeTrend(sparkValues, meta.unit, filter);

        const isBP = meta.key === "bp";
        let displayVal = vital.val;
        let displayUnit = vital.unit || "";
        let label = isBP ? "" : periodLabel[filter];

        if (filter !== "24h" && !isBP && sparkValues.length > 0) {
          displayVal = String(Math.round(sparkValues.reduce((a, b) => a + b, 0) / sparkValues.length));
          displayUnit = meta.unit;
        }

        const maxV = Math.max(...sparkValues);
        const minV = Math.min(...sparkValues);
        const midV = Math.round((maxV + minV) / 2);

        return (
          <div key={meta.key} className="glass-card p-2.5 min-h-[120px]">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1.5 flex items-center justify-between">
              {meta.label}
              <span className="text-[8px] py-0.5 px-1.5 rounded bg-glass-strong text-dim normal-case tracking-normal">
                {meta.src}
              </span>
            </div>

            <div className="flex items-baseline gap-0 flex-wrap">
              <span className="text-[19px] font-mono font-medium leading-none tracking-tight">{displayVal}</span>
              {displayUnit && <span className="text-[10px] text-dim ml-0.5">{displayUnit}</span>}
              {label && (
                <span className="text-[8px] text-dim font-bold ml-1.5 uppercase tracking-wider opacity-70 pb-0.5">
                  {label}
                </span>
              )}
            </div>

            <div className="flex gap-1.5 items-start mt-1.5 mb-0.5">
              {/* Y-scale */}
              <div className="flex flex-col justify-between h-10 w-5 flex-shrink-0 text-right text-[7px] font-mono text-dim opacity-75 py-1">
                <span>{maxV}</span>
                <span>{midV}</span>
                <span>{minV}</span>
              </div>

              {/* Sparkline */}
              <div className="flex-1 min-w-0">
                <Sparkline
                  values={sparkValues}
                  tc={vital.tc}
                  id={`${patientId}-${meta.key}`}
                />
                <div className="flex justify-between text-[7px] font-mono text-dim opacity-70 mt-0.5 tracking-tight">
                  <span>{xStart[filter]}</span>
                  <span>now</span>
                </div>
              </div>
            </div>

            <div className={cn("text-[9px] mt-0.5", getTrendClass(vital.tc))}>{trendText}</div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { patientData } from "@/lib/data/patients";
import { VITAL_META, VitalFilter } from "@/lib/types";
import { cn, getTrendClass } from "@/lib/utils";

interface VitalsTrendChartProps {
  patientId: string;
}

const filters: VitalFilter[] = ["24h", "7d", "15d", "30d"];
const coreVitalKeys = ["hr", "spo2", "bp", "glucose", "temp"];
const colorByKey: Record<string, string> = {
  hr: "#38BDF8",
  spo2: "#5EEAD4",
  bp: "#FBBF24",
  glucose: "#FB7185",
  temp: "#A78BFA",
};

function getFilterValues(history: { daily: number[]; hourly: number[] }, filter: VitalFilter) {
  if (filter === "24h") return history.hourly;
  if (filter === "7d") return history.daily.slice(-7);
  if (filter === "15d") return history.daily.slice(-15);
  return history.daily;
}

function makePath(values: number[], width: number, height: number, pad: number) {
  if (values.length < 2) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;

  const points = values.map((value, index) => [
    pad + (index / (values.length - 1)) * usableW,
    pad + (1 - (value - min) / range) * usableH,
  ]);

  let path = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let index = 1; index < points.length; index++) {
    const cpx = ((points[index - 1][0] + points[index][0]) / 2).toFixed(1);
    path += ` C${cpx},${points[index - 1][1].toFixed(1)} ${cpx},${points[index][1].toFixed(1)} ${points[index][0].toFixed(1)},${points[index][1].toFixed(1)}`;
  }

  return path;
}

function formatDelta(values: number[], unit: string) {
  if (values.length < 2) return "No data";
  const delta = values[values.length - 1] - values[0];
  if (Math.abs(delta) < 1) return "Stable";
  return `${delta > 0 ? "+" : ""}${Math.round(delta)} ${unit}`;
}

export function VitalsTrendChart({ patientId }: VitalsTrendChartProps) {
  const patient = patientData[patientId];
  const [filter, setFilter] = useState<VitalFilter>("7d");
  const [detailFilter, setDetailFilter] = useState<VitalFilter>("7d");
  const [selectedKey, setSelectedKey] = useState("hr");

  const series = useMemo(() => {
    if (!patient) return [];

    return coreVitalKeys
      .map((key) => {
        const meta = VITAL_META.find((item) => item.key === key);
        const vital = patient.vitals[key];
        const history = patient.vitalHistory[key];
        if (!meta || !vital || !history) return null;

        return {
          meta,
          vital,
          values: getFilterValues(history, filter),
          detailValues: getFilterValues(history, detailFilter),
          color: colorByKey[key],
        };
      })
      .filter(Boolean);
  }, [patient, filter, detailFilter]);

  if (!patient) return null;

  const selectedSeries =
    series.find((item) => item?.meta.key === selectedKey) ?? series[0] ?? null;

  const chartSize = 360;
  const chartHeight = 230;
  const pad = 28;
  const detailMin = selectedSeries ? Math.min(...selectedSeries.detailValues) : 0;
  const detailMax = selectedSeries ? Math.max(...selectedSeries.detailValues) : 0;
  const detailMid = Math.round((detailMin + detailMax) / 2);

  return (
    <div className="grid grid-cols-2 gap-3.5">
      <div className="glass-card overflow-hidden">
        <div className="px-3.5 py-3 border-b border-glass-border flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-ink">Core Vital Trends</div>
            <div className="text-[9px] text-dim mt-0.5 truncate">Heart rate, SpO2, BP, glucose, temperature</div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  "py-1 px-2 rounded-[7px] text-[9px] font-bold cursor-pointer border border-glass-border bg-glass-strong text-muted transition-all hover:text-ink",
                  filter === item &&
                    "bg-gradient-to-br from-[rgba(56,189,248,0.18)] to-[rgba(139,92,246,0.18)] text-ink border-[rgba(56,189,248,0.35)]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5">
          <div className="h-[230px] rounded-xl bg-[#08111f]/70 border border-white/[0.06] overflow-hidden">
            <svg viewBox={`0 0 ${chartSize} ${chartHeight}`} className="w-full h-full block" preserveAspectRatio="none">
              {[0, 1, 2, 3].map((line) => {
                const y = pad + (line / 3) * (chartHeight - pad * 2);
                return (
                  <line
                    key={line}
                    x1={pad}
                    y1={y}
                    x2={chartSize - pad}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 6"
                  />
                );
              })}
              {[0, 1, 2, 3].map((line) => {
                const x = pad + (line / 3) * (chartSize - pad * 2);
                return (
                  <line
                    key={line}
                    x1={x}
                    y1={pad}
                    x2={x}
                    y2={chartHeight - pad}
                    stroke="rgba(255,255,255,0.04)"
                  />
                );
              })}

              {series.map((item) => {
                if (!item || item.values.length < 2) return null;
                const isSelected = item.meta.key === selectedSeries?.meta.key;
                const path = makePath(item.values, chartSize, chartHeight, pad);

                return (
                  <g key={item.meta.key}>
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      className="cursor-pointer"
                      onClick={() => setSelectedKey(item.meta.key)}
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={isSelected ? 3.1 : 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={!isSelected ? 0.45 : 0.98}
                      className="cursor-pointer"
                      onClick={() => setSelectedKey(item.meta.key)}
                    />
                  </g>
                );
              })}

              <text x={pad} y={chartHeight - 10} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                {filter === "24h" ? "24h" : filter}
              </text>
              <text x={chartSize - pad - 18} y={chartHeight - 10} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                now
              </text>
            </svg>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {series.map((item) => {
              if (!item) return null;
              return (
                <button
                  key={item.meta.key}
                  onClick={() => setSelectedKey(item.meta.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[8.5px] font-bold text-muted hover:text-ink transition-all",
                    selectedSeries?.meta.key === item.meta.key &&
                      "bg-[rgba(56,189,248,0.12)] border-[rgba(56,189,248,0.35)] text-ink"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-3.5 py-3 border-b border-glass-border flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-ink">
                {selectedSeries?.meta.label ?? "Vital Detail"}
              </span>
              {selectedSeries && (
                <span className={cn("text-[10px] font-bold", getTrendClass(selectedSeries.vital.tc))}>
                  {selectedSeries.vital.val}{selectedSeries.vital.unit || selectedSeries.meta.unit}
                </span>
              )}
            </div>
            {selectedSeries && (
              <div className="text-[9px] text-dim mt-0.5">
                {formatDelta(selectedSeries.detailValues, selectedSeries.meta.unit)}
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setDetailFilter(item)}
                className={cn(
                  "py-1 px-2 rounded-[7px] text-[9px] font-bold cursor-pointer border border-glass-border bg-glass-strong text-muted transition-all hover:text-ink",
                  detailFilter === item &&
                    "bg-[rgba(56,189,248,0.14)] text-[#38bdf8] border-[rgba(56,189,248,0.35)]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5">
          <div className="h-[230px] rounded-xl bg-white/[0.025] border border-white/[0.06] overflow-hidden">
            {selectedSeries && (
              <svg viewBox={`0 0 ${chartSize} ${chartHeight}`} className="w-full h-full block" preserveAspectRatio="none">
                {[0, 1, 2].map((line) => {
                  const y = pad + (line / 2) * (chartHeight - pad * 2);
                  return (
                    <line
                      key={line}
                      x1={pad}
                      y1={y}
                      x2={chartSize - pad}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="4 6"
                    />
                  );
                })}
                <path
                  d={makePath(selectedSeries.detailValues, chartSize, chartHeight, pad)}
                  fill="none"
                  stroke={selectedSeries.color}
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x={8} y={pad + 4} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                  {detailMax}
                </text>
                <text x={8} y={chartHeight / 2 + 3} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                  {detailMid}
                </text>
                <text x={8} y={chartHeight - pad + 4} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                  {detailMin}
                </text>
                <text x={pad} y={chartHeight - 10} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                  {detailFilter === "24h" ? "24h" : detailFilter}
                </text>
                <text x={chartSize - pad - 18} y={chartHeight - 10} fill="rgba(203,213,255,0.58)" fontSize="9" fontFamily="monospace">
                  now
                </text>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

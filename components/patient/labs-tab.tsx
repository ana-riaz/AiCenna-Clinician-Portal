"use client";

import { useMemo, useState } from "react";
import { patientData } from "@/lib/data/patients";
import { cn } from "@/lib/utils";

interface LabsTabProps {
  patientId: string;
}

type LabReading = {
  panel: string;
  dateLabel: string;
  date: Date;
  val: string;
  numVal: number | null;
  ref: string;
  flag: "NORMAL" | "CRITICAL";
};

type LabTestTrend = {
  name: string;
  ref: string;
  latest: LabReading;
  readings: LabReading[];
};

function extractNum(val: string): number | null {
  const match = val.match(/-?[\d]+(?:\.[\d]+)?/);
  return match ? Number(match[0]) : null;
}

function extractUnit(val: string) {
  return val.replace(/-?[\d]+(?:\.[\d]+)?/, "").trim();
}

function parseLabDate(label: string) {
  const dateLabel = label.split(/[·Â]/)[0].trim();
  const date = new Date(dateLabel);
  return { dateLabel, date: Number.isNaN(date.getTime()) ? new Date(0) : date };
}

function extractRefBounds(ref: string) {
  const clean = ref.replace(/â€“/g, "-").replace(/≤/g, "<=").replace(/≥/g, ">=");
  const range = clean.match(/(-?[\d.]+)\s*[-–]\s*(-?[\d.]+)/);
  if (range) return { low: Number(range[1]), high: Number(range[2]), mode: "range" as const };

  const lt = clean.match(/(?:<|<=)\s*(-?[\d.]+)/);
  if (lt) return { low: null, high: Number(lt[1]), mode: "below" as const };

  const gt = clean.match(/(?:>|>=)\s*(-?[\d.]+)/);
  if (gt) return { low: Number(gt[1]), high: null, mode: "above" as const };

  return { low: null, high: null, mode: "unknown" as const };
}

function buildTestTrends(patientId: string) {
  const patient = patientData[patientId];
  const tests = new Map<string, LabTestTrend>();

  for (const lab of patient?.labs || []) {
    const parsedDate = parseLabDate(lab.date);

    for (const row of lab.rows) {
      const reading: LabReading = {
        panel: lab.name,
        dateLabel: parsedDate.dateLabel,
        date: parsedDate.date,
        val: row.val,
        numVal: extractNum(row.val),
        ref: row.ref,
        flag: row.flag,
      };

      const existing = tests.get(row.test);
      if (existing) {
        existing.readings.push(reading);
      } else {
        tests.set(row.test, {
          name: row.test,
          ref: row.ref,
          latest: reading,
          readings: [reading],
        });
      }
    }
  }

  return Array.from(tests.values())
    .map((test) => {
      const readings = [...test.readings].sort((a, b) => a.date.getTime() - b.date.getTime());
      return { ...test, readings, latest: readings[readings.length - 1] };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function distanceFromReference(value: number, ref: string) {
  const bounds = extractRefBounds(ref);
  if (bounds.low !== null && value < bounds.low) return bounds.low - value;
  if (bounds.high !== null && value > bounds.high) return value - bounds.high;
  return 0;
}

function TrendDelta({ test }: { test: LabTestTrend }) {
  const latest = test.latest;
  const prev = test.readings.length >= 2 ? test.readings[test.readings.length - 2] : null;

  if (!prev || latest.numVal === null || prev.numVal === null || prev.numVal === 0) {
    return <span className="text-[9px] text-dim">No prior trend</span>;
  }

  const pct = ((latest.numVal - prev.numVal) / Math.abs(prev.numVal)) * 100;
  const worsening = distanceFromReference(latest.numVal, test.ref) > distanceFromReference(prev.numVal, test.ref);
  const arrow = pct > 0 ? "↑" : pct < 0 ? "↓" : "→";

  return (
    <span className={cn("text-[9px] font-semibold", worsening ? "text-danger" : "text-success")}>
      {arrow} {pct >= 0 ? "+" : ""}
      {pct.toFixed(0)}%
    </span>
  );
}

function LabTrendChart({ test }: { test: LabTestTrend }) {
  const values = test.readings.map((reading) => reading.numVal).filter((value): value is number => value !== null);
  const bounds = extractRefBounds(test.ref);
  const unit = extractUnit(test.latest.val);

  if (!values.length) {
    return (
      <div className="h-[340px] flex items-center justify-center text-[11px] text-dim">
        Numeric trend is not available for this test.
      </div>
    );
  }

  const refNumbers = [bounds.low, bounds.high].filter((value): value is number => value !== null);
  const rawMin = Math.min(...values, ...refNumbers);
  const rawMax = Math.max(...values, ...refNumbers);
  const spread = rawMax - rawMin || Math.max(Math.abs(rawMax), 1);
  const yMin = rawMin - spread * 0.16;
  const yMax = rawMax + spread * 0.18;

  const width = 820;
  const height = 340;
  const margin = { top: 28, right: 34, bottom: 48, left: 72 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const toX = (idx: number) => margin.left + (test.readings.length === 1 ? innerW / 2 : (idx / (test.readings.length - 1)) * innerW);
  const toY = (value: number) => margin.top + ((yMax - value) / (yMax - yMin)) * innerH;
  const points = test.readings
    .map((reading, idx) => (reading.numVal === null ? null : `${toX(idx)},${toY(reading.numVal)}`))
    .filter(Boolean)
    .join(" ");

  const referenceLabel =
    bounds.mode === "range"
      ? `${bounds.low}-${bounds.high}`
      : bounds.mode === "below"
        ? `<= ${bounds.high}`
        : bounds.mode === "above"
          ? `>= ${bounds.low}`
          : test.ref;

  const yTicks = Array.from(new Set([yMin, bounds.low, bounds.high, yMax].filter((value): value is number => value !== null)))
    .sort((a, b) => b - a)
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-[8px] border border-glass-border bg-[#07111f]">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-[360px] w-full">
        <defs>
          <linearGradient id="labTrendLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="#07111f" />

        {bounds.low !== null && bounds.high !== null && (
          <rect
            x={margin.left}
            y={toY(bounds.high)}
            width={innerW}
            height={Math.max(1, toY(bounds.low) - toY(bounds.high))}
            fill="rgba(63,185,80,0.09)"
          />
        )}

        {bounds.high !== null && (
          <line x1={margin.left} x2={width - margin.right} y1={toY(bounds.high)} y2={toY(bounds.high)} stroke="#3fb950" strokeDasharray="6 6" opacity="0.8" />
        )}
        {bounds.low !== null && (
          <line x1={margin.left} x2={width - margin.right} y1={toY(bounds.low)} y2={toY(bounds.low)} stroke="#3fb950" strokeDasharray="6 6" opacity="0.8" />
        )}

        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={toY(tick)} y2={toY(tick)} stroke="rgba(255,255,255,0.06)" />
            <text x={margin.left - 12} y={toY(tick) + 4} textAnchor="end" fill="rgba(226,232,240,0.55)" fontSize="11" fontFamily="monospace">
              {tick.toFixed(Math.abs(tick) >= 100 ? 0 : 1)}
            </text>
          </g>
        ))}

        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="rgba(255,255,255,0.16)" />
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="rgba(255,255,255,0.16)" />

        <text x="18" y={height / 2} transform={`rotate(-90 18 ${height / 2})`} fill="rgba(226,232,240,0.72)" fontSize="11" fontWeight="700">
          Reference range: {referenceLabel} {unit}
        </text>

        <polyline points={points} fill="none" stroke="url(#labTrendLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {test.readings.map((reading, idx) => {
          if (reading.numVal === null) return null;
          const x = toX(idx);
          const y = toY(reading.numVal);
          return (
            <g key={`${reading.dateLabel}-${reading.val}`}>
              <circle cx={x} cy={y} r="6.5" fill={reading.flag === "CRITICAL" ? "#f85149" : "#3fb950"} opacity="0.18" />
              <circle cx={x} cy={y} r="4" fill={reading.flag === "CRITICAL" ? "#f85149" : "#3fb950"} stroke="#07111f" strokeWidth="1.5" />
              <text x={x} y={height - margin.bottom + 20} textAnchor="middle" fill="rgba(226,232,240,0.55)" fontSize="10">
                {reading.dateLabel.replace(/,\s*20/, " '")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LabsTab({ patientId }: LabsTabProps) {
  const patient = patientData[patientId];
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const tests = useMemo(() => buildTestTrends(patientId), [patientId]);

  if (!patient) return null;

  const selected = selectedTest ? tests.find((test) => test.name === selectedTest) : null;
  const criticalNow = tests.filter((test) => test.latest.flag === "CRITICAL").length;
  const totalReadings = tests.reduce((sum, test) => sum + test.readings.length, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Lab Panels</div>
            <div className="text-xl font-bold text-ink">{patient.labs.length}</div>
          </div>
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Tests Listed</div>
            <div className="text-xl font-bold text-ink">{tests.length}</div>
          </div>
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Critical Now</div>
            <div className={cn("text-xl font-bold", criticalNow > 0 ? "text-danger" : "text-success")}>{criticalNow}</div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-4 pt-3.5 pb-2.5 border-b border-glass-border flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-ink">{selected ? selected.name : "All Lab Tests"}</div>
              <div className="text-[9px] text-dim mt-0.5">
                {selected ? `${selected.readings.length} readings · reference ${selected.ref}` : `${totalReadings} total readings across this patient`}
              </div>
            </div>
            {selected && (
              <button
                onClick={() => setSelectedTest(null)}
                className="px-3 py-1.5 rounded-[7px] border border-glass-border bg-glass-strong text-[10px] font-bold text-muted hover:text-ink transition-colors"
              >
                Back to Tests
              </button>
            )}
          </div>

          {selected ? (
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3 text-[9px] text-dim">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#f85149]" />
                  Critical value
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
                  Normal value
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0 border-t border-dashed border-[#3fb950] opacity-70" />
                  Reference range
                </span>
              </div>

              <LabTrendChart test={selected} />

              <div className="overflow-hidden rounded-[8px] border border-glass-border">
                <div className="grid grid-cols-[1fr_1fr_1fr_90px] gap-x-3 px-4 py-2 border-b border-glass-border bg-white/[0.02]">
                  <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Date</div>
                  <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Value</div>
                  <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Panel</div>
                  <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Status</div>
                </div>
                {selected.readings.map((reading) => (
                  <div key={`${reading.dateLabel}-${reading.panel}-${reading.val}`} className="grid grid-cols-[1fr_1fr_1fr_90px] gap-x-3 px-4 py-2.5 border-b border-white/[0.04] last:border-b-0 items-center">
                    <div className="text-[10px] text-muted">{reading.dateLabel}</div>
                    <div className={cn("text-[11px] font-mono font-semibold", reading.flag === "CRITICAL" ? "text-danger" : "text-success")}>{reading.val}</div>
                    <div className="text-[10px] text-dim truncate">{reading.panel}</div>
                    <div>
                      <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border", reading.flag === "CRITICAL" ? "bg-danger/10 text-danger border-danger/25" : "bg-success/10 text-success border-success/25")}>
                        {reading.flag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-[1.7fr_1fr_1fr_90px_110px] gap-x-3 px-4 py-2 border-b border-glass-border bg-white/[0.02]">
                <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Test</div>
                <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Latest</div>
                <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Reference</div>
                <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Status</div>
                <div className="text-[9px] font-bold text-dim uppercase tracking-wider text-right">Trend</div>
              </div>

              {tests.map((test) => (
                <div
                  key={test.name}
                  className="grid grid-cols-[1.7fr_1fr_1fr_90px_110px] gap-x-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0 items-center hover:bg-white/[0.015] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-muted truncate" title={test.name}>
                      {test.name}
                    </div>
                    <div className="text-[9px] text-dim mt-0.5">
                      {test.readings.length} readings · latest {test.latest.dateLabel}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className={cn("text-[11px] font-mono font-semibold truncate", test.latest.flag === "CRITICAL" ? "text-danger" : "text-success")}>
                      {test.latest.val}
                    </div>
                    <TrendDelta test={test} />
                  </div>

                  <div className="text-[10px] text-dim font-mono truncate">{test.ref}</div>

                  <div>
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border", test.latest.flag === "CRITICAL" ? "bg-danger/10 text-danger border-danger/25" : "bg-success/10 text-success border-success/25")}>
                      {test.latest.flag}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedTest(test.name)}
                      className="px-3 py-1.5 rounded-[7px] border border-cyan-300/25 bg-cyan-300/10 text-[10px] font-bold text-cyan-100 hover:bg-cyan-300/15 transition-colors"
                    >
                      View Trends
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { cn, getScoreClass } from "@/lib/utils";

interface ScoreRingProps {
  label: string;
  value: number;
  tone: "cyan" | "health" | "risk";
  delay?: number;
}

export function diseaseRiskScore(risk: string) {
  if (risk === "cr") return 92;
  if (risk === "hi") return 76;
  if (risk === "me") return 58;
  if (risk === "st") return 28;
  return 18;
}

export function ScoreRing({ label, value, tone, delay = 0 }: ScoreRingProps) {
  const circumference = 87.96;
  const fill = ((Math.max(0, Math.min(100, value)) / 100) * circumference).toFixed(2);
  const toneClass =
    tone === "risk"
      ? value >= 80
        ? "text-danger"
        : value >= 55
          ? "text-warning"
          : "text-success"
      : tone === "health"
        ? getScoreClass(value)
        : "text-cyan";
  const stroke = tone === "risk" ? "var(--danger)" : tone === "health" ? "currentColor" : "var(--cyan)";

  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${value}/100`}>
      <div className="relative h-9 w-9 flex-shrink-0">
        <svg viewBox="0 0 36 36" className={cn("h-9 w-9 -rotate-90", toneClass)}>
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.2" />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={stroke}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circumference}`}
            className="animate-ring-in"
            style={{ animationDelay: `${delay}ms` }}
          />
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center text-[10px] font-black font-mono", toneClass)}>
          {value}
        </div>
      </div>
      <div className="text-[8px] font-bold uppercase text-dim leading-tight">{label}</div>
    </div>
  );
}

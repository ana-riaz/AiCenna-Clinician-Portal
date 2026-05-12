"use client";

interface SparklineProps {
  values: number[];
  tc: "n" | "e" | "c";
  id: string;
}

const colors = {
  n: "var(--success)",
  e: "var(--warning)",
  c: "var(--danger)",
};

export function Sparkline({ values, tc, id }: SparklineProps) {
  if (!values || values.length < 2) return null;

  const W = 100;
  const H = 36;
  const pad = 3;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = Math.max(maxV - minV, 1);

  const points = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - pad - ((v - minV) / range) * (H - pad * 2),
  ]);

  const color = colors[tc] || "var(--muted)";
  const gradientId = `sg-${id}`;

  // Build smooth path
  let linePath = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = ((points[i - 1][0] + points[i][0]) / 2).toFixed(1);
    linePath += ` C${cpx},${points[i - 1][1].toFixed(1)} ${cpx},${points[i][1].toFixed(1)} ${points[i][0].toFixed(1)},${points[i][1].toFixed(1)}`;
  }

  const areaPath = linePath + ` L${W},${H} L0,${H} Z`;
  const [lx, ly] = points[points.length - 1];

  return (
    <svg className="w-full h-10 block overflow-visible" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      <line x1="0" y1={pad} x2={W} y2={pad} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="2,3" />
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2,3" />
      <line x1="0" y1={H - pad} x2={W} y2={H - pad} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" strokeDasharray="2,3" />

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* End dot */}
      <circle cx={lx.toFixed(1)} cy={ly.toFixed(1)} r="2.5" fill={color} />
    </svg>
  );
}

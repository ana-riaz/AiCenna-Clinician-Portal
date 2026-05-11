"use client";

import { Patient } from "@/lib/types";
import { FlaskConical, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";

interface LabsTabProps {
  patient: Patient;
}

export function LabsTab({ patient }: LabsTabProps) {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-emerald-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: "normal" | "abnormal" | "critical") => {
    switch (status) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30">
            <AlertTriangle className="w-3 h-3" />
            Critical
          </span>
        );
      case "abnormal":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Abnormal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            Normal
          </span>
        );
    }
  };

  // Group labs by category
  const labsByCategory = patient.labs.reduce((acc, lab) => {
    if (!acc[lab.category]) {
      acc[lab.category] = [];
    }
    acc[lab.category].push(lab);
    return acc;
  }, {} as Record<string, typeof patient.labs>);

  const categoryIcons: Record<string, string> = {
    "Blood Chemistry": "bg-red-500/10 text-red-500",
    "Lipid Panel": "bg-amber-500/10 text-amber-500",
    "Liver Function": "bg-emerald-500/10 text-emerald-500",
    "Kidney Function": "bg-blue-500/10 text-blue-500",
    "Thyroid Panel": "bg-purple-500/10 text-purple-500",
    "Complete Blood Count": "bg-pink-500/10 text-pink-500",
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Tests</div>
          <div className="text-2xl font-bold text-foreground">{patient.labs.length}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Normal</div>
          <div className="text-2xl font-bold text-emerald-500">
            {patient.labs.filter((l) => l.status === "normal").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Abnormal</div>
          <div className="text-2xl font-bold text-amber-500">
            {patient.labs.filter((l) => l.status === "abnormal").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-500">
            {patient.labs.filter((l) => l.status === "critical").length}
          </div>
        </div>
      </div>

      {/* Labs by Category */}
      {Object.entries(labsByCategory).map(([category, labs]) => (
        <div key={category} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryIcons[category] || "bg-muted text-muted-foreground"}`}>
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
            <span className="text-sm text-muted-foreground ml-auto">{labs.length} tests</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Test Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reference Range</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trend</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {labs.map((lab, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-foreground">{lab.name}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-mono font-medium ${
                          lab.status === "critical"
                            ? "text-red-500"
                            : lab.status === "abnormal"
                            ? "text-amber-500"
                            : "text-foreground"
                        }`}
                      >
                        {lab.value} {lab.unit}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-sm">{lab.referenceRange}</td>
                    <td className="p-4">{getTrendIcon(lab.trend)}</td>
                    <td className="p-4">{getStatusBadge(lab.status)}</td>
                    <td className="p-4 text-muted-foreground text-sm">{lab.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

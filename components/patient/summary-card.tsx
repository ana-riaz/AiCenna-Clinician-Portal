"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface SummaryCardProps {
  patientId: string;
}

const AI_SUGGESTIONS = [
  "Review medication dosage in context of current vitals.",
  "Consider referral to relevant specialist if trends persist.",
  "Schedule follow-up within 2 weeks to reassess.",
  "Patient education on lifestyle risk factors recommended.",
];

type Mode = "default" | "verifying" | "discarding";

export function SummaryCard({ patientId }: SummaryCardProps) {
  const { summaryVerified, verifySummary } = useApp();
  const patient = patientData[patientId];

  const [mode, setMode] = useState<Mode>("default");
  const [customSuggestions, setCustomSuggestions] = useState<string[]>([]);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [discardReason, setDiscardReason] = useState("");
  const [discarded, setDiscarded] = useState(false);

  if (!patient) return null;

  const verified = summaryVerified[patientId];
  const isHigh = patient.summaryBadge === "h";

  const addSuggestion = () => {
    const trimmed = newSuggestion.trim();
    if (!trimmed) return;
    setCustomSuggestions((prev) => [...prev, trimmed]);
    setNewSuggestion("");
  };

  const removeCustom = (idx: number) =>
    setCustomSuggestions((prev) => prev.filter((_, i) => i !== idx));

  if (discarded) {
    return (
      <div className="glass-card p-4 flex items-center gap-2 text-[11px]">
        <span className="text-[9px] font-bold uppercase tracking-wider text-dim">Summary discarded</span>
        {discardReason && <span className="text-muted">· {discardReason}</span>}
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap mb-3 pb-2 border-b border-glass-border">
        <div className="text-[9px] font-bold text-dim uppercase tracking-wider">AI Summary</div>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-bold",
            isHigh ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
          )}
        >
          {isHigh ? "High Confidence" : "Medium Confidence"}
        </span>
        {verified && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/15 text-blue-400">
            Verified
          </span>
        )}
      </div>

      {/* Summary text */}
      <p className="text-[11px] text-muted leading-relaxed mb-3">{patient.summaryDoc}</p>

      {/* Key findings */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {patient.findings.map((f, i) => (
          <span
            key={i}
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[9px] font-semibold",
              f.sev === "h"
                ? "bg-danger/15 text-danger"
                : f.sev === "m"
                ? "bg-warning/15 text-warning"
                : "bg-blue-500/15 text-blue-400"
            )}
          >
            {f.txt.split("·")[0].trim()}
          </span>
        ))}
      </div>

      {/* Default action row */}
      {!verified && mode === "default" && (
        <div className="flex gap-2 pt-2 border-t border-glass-border">
          <button
            onClick={() => setMode("verifying")}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-success/20 text-success hover:bg-success/30 transition-all"
          >
            Verify Summary
          </button>
          <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-glass text-dim hover:text-muted transition-all border border-glass-border">
            Edit
          </button>
          <button
            onClick={() => setMode("discarding")}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-danger/15 text-danger hover:bg-danger/25 transition-all ml-auto"
          >
            Discard
          </button>
        </div>
      )}

      {/* Verify flow — AI suggestions */}
      {mode === "verifying" && (
        <div className="pt-3 mt-1 border-t border-glass-border flex flex-col gap-3">
          <div className="text-[9px] font-bold tracking-widest text-[#38bdf8]">✦ AI SUGGESTIONS</div>

          <div className="flex flex-col gap-2">
            {[...AI_SUGGESTIONS, ...customSuggestions].map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#38bdf8] font-bold text-[10px] flex-shrink-0 mt-0.5 w-4">
                  {i + 1}.
                </span>
                <span className="text-[11px] text-muted leading-snug flex-1">{s}</span>
                {i >= AI_SUGGESTIONS.length && (
                  <button
                    onClick={() => removeCustom(i - AI_SUGGESTIONS.length)}
                    className="text-dim hover:text-danger transition-colors flex-shrink-0 mt-0.5"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add suggestion input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSuggestion()}
              placeholder="Add your own suggestion..."
              className="flex-1 bg-field border border-field-border rounded-lg px-3 py-1.5 text-[11px] text-ink placeholder:text-dim outline-none focus:border-[#38bdf8] transition-colors"
            />
            <button
              onClick={addSuggestion}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[rgba(56,189,248,0.12)] text-[#38bdf8] border border-[rgba(56,189,248,0.25)] hover:bg-[rgba(56,189,248,0.22)] transition-all"
            >
              <Plus size={10} />
              Add
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { verifySummary(patientId); setMode("default"); }}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-success/20 text-success hover:bg-success/30 transition-all"
            >
              Confirm &amp; Verify
            </button>
            <button
              onClick={() => setMode("default")}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-glass text-dim hover:text-muted transition-all border border-glass-border"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Discard flow — reason */}
      {mode === "discarding" && (
        <div className="pt-3 mt-1 border-t border-glass-border flex flex-col gap-3">
          <div className="text-[10px] font-bold text-dim">Reason for discarding</div>
          <textarea
            value={discardReason}
            onChange={(e) => setDiscardReason(e.target.value)}
            placeholder="Enter reason..."
            rows={2}
            className="w-full bg-field border border-field-border rounded-lg px-3 py-2 text-[11px] text-ink placeholder:text-dim outline-none focus:border-danger resize-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setDiscarded(true)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-danger/15 text-danger hover:bg-danger/25 transition-all"
            >
              Confirm Discard
            </button>
            <button
              onClick={() => { setMode("default"); setDiscardReason(""); }}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-glass text-dim hover:text-muted transition-all border border-glass-border"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

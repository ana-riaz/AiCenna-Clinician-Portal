"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { getAllPatients } from "@/lib/data/patients";
import { LabCaseStatus } from "@/lib/types";
import { cn, getAvatarClass, getRiskClass } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Stethoscope,
  X,
} from "lucide-react";

type Patient = ReturnType<typeof getAllPatients>[0];
type LabPanel = Patient["labs"][0];
type LabRow = LabPanel["rows"][0];

interface LabCase {
  id: string;
  patient: Patient;
  panel: LabPanel;
  row: LabRow;
  direction: "HIGH" | "LOW" | null;
}

interface ActiveCase {
  labCase: LabCase;
  status: LabCaseStatus;
}

const PATIENT_CASE_LIMITS: Record<string, number> = {
  ahmed: 2,
};

const PATIENT_CASE_PRIORITY: Record<string, string[]> = {
  ahmed: ["Platelet Count", "Undifferentiated Blasts"],
};

function splitLabDate(date: string) {
  return date.split(/(?:\s*·\s*|\s*Â·\s*)/)[0].trim();
}

function parseDate(date: string) {
  const parsed = new Date(splitLabDate(date));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function getLatestPanels(patient: Patient): LabPanel[] {
  const byName = new Map<string, LabPanel>();
  for (const lab of patient.labs) {
    const prev = byName.get(lab.name);
    if (!prev || parseDate(lab.date) > parseDate(prev.date)) {
      byName.set(lab.name, lab);
    }
  }
  return Array.from(byName.values());
}

function parseRef(ref: string): { low: number | null; high: number | null } {
  const clean = ref.replace(/[%a-zA-Z×x⁰¹²³⁴⁵⁶⁷⁸⁹]/g, "").trim();
  const range = clean.match(/^([\d.]+)\s*[–-]\s*([\d.]+)/);
  if (range) return { low: parseFloat(range[1]), high: parseFloat(range[2]) };
  const lt = clean.match(/^[<≤]\s*([\d.]+)/);
  if (lt) return { low: null, high: parseFloat(lt[1]) };
  const gt = clean.match(/^[>≥]\s*([\d.]+)/);
  if (gt) return { low: parseFloat(gt[1]), high: null };
  return { low: null, high: null };
}

function getDirection(val: string, ref: string): "HIGH" | "LOW" | null {
  const numMatch = val.match(/([\d]+\.?[\d]*)/);
  if (!numMatch) return null;
  const num = parseFloat(numMatch[1]);
  const { low, high } = parseRef(ref);
  if (high !== null && num > high) return "HIGH";
  if (low !== null && num < low) return "LOW";
  return null;
}

function buildCaseId(patient: Patient, panel: LabPanel, row: LabRow) {
  return [
    patient.id,
    panel.name,
    splitLabDate(panel.date),
    row.test,
  ].join("::");
}

function prioritizePatientCases(patient: Patient, cases: LabCase[]) {
  const limit = PATIENT_CASE_LIMITS[patient.id];
  if (!limit) return cases;

  const priority = PATIENT_CASE_PRIORITY[patient.id] ?? [];

  return [...cases]
    .sort((a, b) => {
      const aPriority = priority.indexOf(a.row.test);
      const bPriority = priority.indexOf(b.row.test);
      if (aPriority !== -1 || bPriority !== -1) {
        return (aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority) -
          (bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority);
      }

      const dateDelta = parseDate(b.panel.date).getTime() - parseDate(a.panel.date).getTime();
      if (dateDelta !== 0) return dateDelta;
      return a.row.test.localeCompare(b.row.test);
    })
    .slice(0, limit);
}

function getCriticalCases() {
  return getAllPatients()
    .flatMap((patient) => {
      const patientCases = getLatestPanels(patient).flatMap((panel) =>
        panel.rows
          .filter((row) => row.flag === "CRITICAL")
          .map((row) => ({
            id: buildCaseId(patient, panel, row),
            patient,
            panel,
            row,
            direction: getDirection(row.val, row.ref),
          }))
      );

      return prioritizePatientCases(patient, patientCases);
    })
    .sort((a, b) => {
      const dateDelta = parseDate(b.panel.date).getTime() - parseDate(a.panel.date).getTime();
      if (dateDelta !== 0) return dateDelta;
      return a.patient.name.localeCompare(b.patient.name);
    });
}

export function LabsView() {
  const { labCaseUpdates, updateLabCase, openPatient } = useApp();
  const [activeCase, setActiveCase] = useState<ActiveCase | null>(null);
  const [note, setNote] = useState("");

  const allCases = useMemo(() => getCriticalCases(), []);
  const visibleCases = allCases.filter(
    (labCase) => labCaseUpdates[labCase.id]?.status !== "resolved"
  );
  const actionCount = visibleCases.filter(
    (labCase) => labCaseUpdates[labCase.id]?.status === "action"
  ).length;
  const patientCount = new Set(visibleCases.map((labCase) => labCase.patient.id)).size;

  const groupedCases = visibleCases.reduce<Record<string, LabCase[]>>((groups, labCase) => {
    if (!groups[labCase.patient.id]) groups[labCase.patient.id] = [];
    groups[labCase.patient.id].push(labCase);
    return groups;
  }, {});

  const openNoteFlow = (labCase: LabCase, status: LabCaseStatus) => {
    setActiveCase({ labCase, status });
    setNote(labCaseUpdates[labCase.id]?.note || "");
  };

  const closeNoteFlow = () => {
    setActiveCase(null);
    setNote("");
  };

  const submitNote = () => {
    if (!activeCase || !note.trim()) return;
    updateLabCase(activeCase.labCase.id, activeCase.status, note.trim());
    closeNoteFlow();
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[15px] font-extrabold tracking-tight mb-1">Lab Reports</div>
          <div className="text-[11px] text-muted">
            Critical out-of-range tests that still need review. Resolved items leave this queue.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 min-w-[330px]">
          <div className="glass-card px-3 py-2">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Open</div>
            <div className="text-lg font-bold text-danger leading-tight">{visibleCases.length}</div>
          </div>
          <div className="glass-card px-3 py-2">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Action</div>
            <div className="text-lg font-bold text-warning leading-tight">{actionCount}</div>
          </div>
          <div className="glass-card px-3 py-2">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider">Patients</div>
            <div className="text-lg font-bold text-ink leading-tight">{patientCount}</div>
          </div>
        </div>
      </div>

      {visibleCases.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={20} />
          </div>
          <div className="text-[13px] font-bold text-success mb-1">All critical lab cases resolved</div>
          <div className="text-[11px] text-muted">There are no unresolved critical lab results in the current queue.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {Object.entries(groupedCases).map(([patientId, cases]) => {
            const patient = cases[0].patient;
            const inAction = cases.filter((labCase) => labCaseUpdates[labCase.id]?.status === "action").length;

            return (
              <div key={patientId} className="glass-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-glass-border">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-[36px] h-[36px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        getAvatarClass(patient.risk)
                      )}
                    >
                      {patient.init}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-ink">{patient.name}</div>
                      <div className="text-[10px] text-muted mt-0.5 truncate">{patient.meta}</div>
                    </div>
                    <span
                      className={cn(
                        "py-0.5 px-2.5 rounded-full text-[9px] font-bold tracking-wide flex-shrink-0",
                        getRiskClass(patient.risk)
                      )}
                    >
                      {patient.rl}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-[10px] font-bold text-danger">{cases.length} open</span>
                    {inAction > 0 && (
                      <span className="text-[10px] font-bold text-warning">{inAction} in action</span>
                    )}
                    <button
                      onClick={() => openPatient(patient.id, "labs", "labs")}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-glass-strong border border-glass-border rounded-lg text-muted text-[10px] cursor-pointer font-semibold transition-all hover:bg-[rgba(56,189,248,0.15)] hover:border-[#38bdf8] hover:text-[#38bdf8]"
                    >
                      View Trends
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                  {cases.map((labCase) => {
                    const update = labCaseUpdates[labCase.id];
                    const isAction = update?.status === "action";

                    return (
                      <div key={labCase.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                        <div className="grid grid-cols-[minmax(180px,1.2fr)_minmax(140px,0.75fr)_minmax(130px,0.75fr)_220px] gap-3 items-start">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-bold text-ink truncate" title={labCase.row.test}>
                                {labCase.row.test}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-danger/15 text-danger border border-danger/20">
                                CRITICAL
                              </span>
                              {isAction && (
                                <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-warning/15 text-warning border border-warning/20">
                                  ACTION
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-dim truncate">
                              {labCase.panel.name} | {labCase.panel.date}
                            </div>
                            {update?.note && (
                              <div className="mt-2 flex gap-1.5 text-[10px] text-muted leading-snug bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-2">
                                <FileText size={11} className="text-[#38bdf8] mt-0.5 flex-shrink-0" />
                                <span>{update.note}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Result</div>
                            <div className="font-mono text-[12px] font-bold text-danger">{labCase.row.val}</div>
                            {labCase.direction && (
                              <div className="text-[9px] font-bold text-danger mt-0.5">
                                {labCase.direction === "HIGH" ? "Above range" : "Below range"}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Reference</div>
                            <div className="font-mono text-[11px] text-muted">{labCase.row.ref}</div>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openNoteFlow(labCase, "action")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-warning/15 text-warning border border-warning/25 hover:bg-warning/25 transition-all"
                            >
                              <Stethoscope size={12} />
                              Take Action
                            </button>
                            <button
                              onClick={() => openNoteFlow(labCase, "resolved")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-success/15 text-success border border-success/25 hover:bg-success/25 transition-all"
                            >
                              <CheckCircle2 size={12} />
                              Resolve
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeNoteFlow} />
          <div className="relative w-full max-w-lg glass-card overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-glass-border">
              <div>
                <div className="text-[12px] font-bold text-ink">
                  {activeCase.status === "resolved" ? "Resolve critical result" : "Take clinical action"}
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  {activeCase.labCase.patient.name} | {activeCase.labCase.row.test} | {activeCase.labCase.row.val}
                </div>
              </div>
              <button
                onClick={closeNoteFlow}
                className="p-1.5 rounded-lg text-dim hover:text-ink hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2.5">
                <ClipboardList size={14} className="text-[#38bdf8] mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-muted leading-relaxed">
                  Add the clinical note that explains the decision. Resolved items are removed from this queue; action items remain visible until resolved.
                </div>
              </div>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder={
                  activeCase.status === "resolved"
                    ? "Example: Reviewed trend and repeat panel. No further action required at this time."
                    : "Example: Ordered repeat CBC and requested hematology consult within 7 days."
                }
                className="w-full bg-field border border-field-border rounded-xl px-3 py-2.5 text-[11px] text-ink placeholder:text-dim outline-none focus:border-[#38bdf8] resize-none transition-colors"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="text-[9px] text-dim">
                  Note is required to update the lab case.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={closeNoteFlow}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-glass text-dim hover:text-muted transition-all border border-glass-border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitNote}
                    disabled={!note.trim()}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                      activeCase.status === "resolved"
                        ? "bg-success/15 text-success border-success/25 hover:bg-success/25"
                        : "bg-warning/15 text-warning border-warning/25 hover:bg-warning/25",
                      !note.trim() && "opacity-45 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {activeCase.status === "resolved" ? "Save & Resolve" : "Save Action"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

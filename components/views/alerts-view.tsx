"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { Alert, AlertCaseStatus } from "@/lib/types";
import { cn, formatRelativeTime, getAvatarClass, getRiskClass } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  Stethoscope,
  X,
} from "lucide-react";

type AlertFilter = "all" | "critical" | "warning" | "action";
type AlertGroup = "severity" | "patient";

interface ActiveAlert {
  alert: Alert;
  status?: AlertCaseStatus;
  note?: string;
}

interface NoteFlow {
  alert: Alert;
  status: AlertCaseStatus;
}

function getIndicatorClass(alert: Alert) {
  return alert.severity === "critical" ? "bg-danger" : "bg-warning";
}

function getIconClass(alert: Alert) {
  return alert.severity === "critical"
    ? "bg-danger/12 text-danger"
    : "bg-warning/12 text-warning";
}

function getFilteredAlerts(alerts: ActiveAlert[], filter: AlertFilter) {
  if (filter === "critical") return alerts.filter((item) => item.alert.severity === "critical");
  if (filter === "warning") return alerts.filter((item) => item.alert.severity === "warning");
  if (filter === "action") return alerts.filter((item) => item.status === "action");
  return alerts;
}

export function AlertsView() {
  const { alerts, alertCaseUpdates, handleAlertClick, updateAlertCase } = useApp();
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [groupBy, setGroupBy] = useState<AlertGroup>("severity");
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [noteFlow, setNoteFlow] = useState<NoteFlow | null>(null);
  const [note, setNote] = useState("");

  const activeAlerts: ActiveAlert[] = alerts
    .filter(
      (alert) =>
        alert.panel &&
        alert.type === "vital" &&
        alertCaseUpdates[alert.id]?.status !== "resolved"
    )
    .map((alert) => ({
      alert,
      status: alertCaseUpdates[alert.id]?.status,
      note: alertCaseUpdates[alert.id]?.note,
    }));

  const visibleAlerts = getFilteredAlerts(activeAlerts, filter);
  const criticalCount = activeAlerts.filter((item) => item.alert.severity === "critical").length;
  const warningCount = activeAlerts.filter((item) => item.alert.severity === "warning").length;
  const actionCount = activeAlerts.filter((item) => item.status === "action").length;

  const openNoteFlow = (alert: Alert, status: AlertCaseStatus) => {
    setNoteFlow({ alert, status });
    setNote(alertCaseUpdates[alert.id]?.note || "");
  };

  const closeNoteFlow = () => {
    setNoteFlow(null);
    setNote("");
  };

  const submitNote = () => {
    if (!noteFlow || !note.trim()) return;
    updateAlertCase(noteFlow.alert.id, noteFlow.status, note.trim());
    closeNoteFlow();
  };

  const renderAlertRow = ({ alert, status, note: savedNote }: ActiveAlert) => {
    const patient = patientData[alert.patId];

    return (
      <div
        key={alert.id}
        className={cn(
          "relative p-3 pl-4 border-b border-[rgba(255,255,255,0.05)] last:border-b-0 hover:bg-[rgba(255,255,255,0.025)] transition-all",
          status === "action" && "bg-gradient-to-r from-warning/5 to-transparent"
        )}
      >
        <div className={cn("absolute left-0 top-0 bottom-0 w-0.5 rounded-r-sm opacity-90", getIndicatorClass(alert))} />

        <div className="grid grid-cols-[minmax(220px,1.3fr)_minmax(170px,0.8fr)_220px] gap-3 items-start">
          <button
            onClick={() => handleAlertClick(alert)}
            className="text-left flex items-start gap-2.5 min-w-0"
          >
            <div className={cn("w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0", getIconClass(alert))}>
              {alert.severity === "critical" ? <AlertTriangle size={14} /> : <AlertCircle size={14} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span
                  className={cn(
                    "text-[8px] font-bold uppercase tracking-wide py-0.5 px-1.5 rounded-sm",
                    alert.severity === "critical" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
                  )}
                >
                  {alert.severity}
                </span>
                {status === "action" && (
                  <span className="text-[8px] font-bold uppercase tracking-wide py-0.5 px-1.5 rounded-sm bg-warning/15 text-warning">
                    Action
                  </span>
                )}
                <span className="text-[9px] text-dim font-medium">{formatRelativeTime(alert.time)}</span>
              </div>
              <div className="text-[11px] font-semibold text-ink leading-tight">{alert.title}</div>
              <div className="text-[10px] text-muted leading-snug mt-0.5">{alert.body}</div>
              {savedNote && (
                <div className="mt-2 flex gap-1.5 text-[10px] text-muted leading-snug bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-2">
                  <FileText size={11} className="text-[#38bdf8] mt-0.5 flex-shrink-0" />
                  <span>{savedNote}</span>
                </div>
              )}
            </div>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {patient && (
              <>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0",
                    getAvatarClass(patient.risk)
                  )}
                >
                  {patient.init}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-ink truncate">{patient.name}</div>
                  <span
                    className={cn(
                      "inline-block mt-1 py-0.5 px-2 rounded-full text-[8px] font-bold tracking-wide",
                      getRiskClass(patient.risk)
                    )}
                  >
                    {patient.rl}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => openNoteFlow(alert, "action")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-warning/15 text-warning border border-warning/25 hover:bg-warning/25 transition-all"
            >
              <Stethoscope size={12} />
              Take Action
            </button>
            <button
              onClick={() => openNoteFlow(alert, "resolved")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-success/15 text-success border border-success/25 hover:bg-success/25 transition-all"
            >
              <CheckCircle2 size={12} />
              Resolve
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmpty = () => (
    <div className="text-center text-dim text-sm py-16 bg-[rgba(255,255,255,0.02)] border border-dashed border-[rgba(255,255,255,0.1)] rounded-[14px]">
      No vital alerts match this filter
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">

      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-3 relative overflow-hidden border-t-2 border-t-danger">
          <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-danger/12 text-danger mb-2">
            <AlertTriangle size={14} />
          </div>
          <div className="font-mono text-xl font-bold text-danger leading-none">{criticalCount}</div>
          <div className="text-[9px] text-muted font-medium uppercase tracking-wide mt-0.5">Critical Vitals</div>
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-3 relative overflow-hidden border-t-2 border-t-warning">
          <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-warning/12 text-warning mb-2">
            <AlertCircle size={14} />
          </div>
          <div className="font-mono text-xl font-bold text-warning leading-none">{warningCount}</div>
          <div className="text-[9px] text-muted font-medium uppercase tracking-wide mt-0.5">Warnings</div>
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-3 relative overflow-hidden border-t-2 border-t-[#38bdf8]">
          <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-[#38bdf8]/12 text-[#38bdf8] mb-2">
            <Stethoscope size={14} />
          </div>
          <div className="font-mono text-xl font-bold text-[#38bdf8] leading-none">{actionCount}</div>
          <div className="text-[9px] text-muted font-medium uppercase tracking-wide mt-0.5">In Action</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-2 px-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg">
        <div className="flex gap-1.5">
          <div className="relative">
            <button
              onClick={() => {
                setFilterOpen(!filterOpen);
                setGroupOpen(false);
              }}
              className="flex items-center gap-1.5 py-2 px-3.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg text-muted text-xs font-medium cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.08)]"
            >
              <span className="text-dim text-[10px]">Filter</span>
              <span className="capitalize">{filter}</span>
              <ChevronDown size={10} />
            </button>
            {filterOpen && (
              <div className="absolute top-full mt-1 left-0 bg-[rgba(8,18,37,0.98)] border border-glass-border rounded-lg py-1 z-50 min-w-[120px]">
                {(["all", "critical", "warning", "action"] as AlertFilter[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFilter(item);
                      setFilterOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-xs hover:bg-glass transition-colors capitalize",
                      filter === item && "text-[#38bdf8] bg-[rgba(56,189,248,0.1)]"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setGroupOpen(!groupOpen);
                setFilterOpen(false);
              }}
              className="flex items-center gap-1.5 py-2 px-3.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg text-muted text-xs font-medium cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.08)]"
            >
              <span className="text-dim text-[10px]">Group by</span>
              <span className="capitalize">{groupBy}</span>
              <ChevronDown size={10} />
            </button>
            {groupOpen && (
              <div className="absolute top-full mt-1 left-0 bg-[rgba(8,18,37,0.98)] border border-glass-border rounded-lg py-1 z-50 min-w-[120px]">
                {(["severity", "patient"] as AlertGroup[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setGroupBy(item);
                      setGroupOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-xs hover:bg-glass transition-colors capitalize",
                      groupBy === item && "text-[#38bdf8] bg-[rgba(56,189,248,0.1)]"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {groupBy === "severity" ? (
        <div className="flex flex-col gap-2.5">
          {(["critical", "warning"] as const).map((severity) => {
            const items = visibleAlerts.filter((item) => item.alert.severity === severity);
            if (!items.length) return null;
            return (
              <div key={severity}>
                <div className="flex items-center gap-2 mb-1.5 px-0.5">
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                      severity === "critical" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
                    )}
                  >
                    {severity}
                  </span>
                  <span className="text-[9px] text-dim">{items.length} alert{items.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="glass-card overflow-hidden">{items.map(renderAlertRow)}</div>
              </div>
            );
          })}
          {visibleAlerts.length === 0 && renderEmpty()}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {Object.entries(
            visibleAlerts.reduce<Record<string, ActiveAlert[]>>((groups, item) => {
              if (!groups[item.alert.patId]) groups[item.alert.patId] = [];
              groups[item.alert.patId].push(item);
              return groups;
            }, {})
          ).map(([patId, items]) => (
            <div key={patId}>
              <div className="flex items-center gap-2 mb-1.5 px-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-dim">
                  {patientData[patId]?.name || patId}
                </span>
                <span className="text-[9px] text-dim">{items.length} alert{items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="glass-card overflow-hidden">{items.map(renderAlertRow)}</div>
            </div>
          ))}
          {visibleAlerts.length === 0 && renderEmpty()}
        </div>
      )}

      {noteFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeNoteFlow} />
          <div className="relative w-full max-w-lg glass-card overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-glass-border">
              <div>
                <div className="text-[12px] font-bold text-ink">
                  {noteFlow.status === "resolved" ? "Resolve vital alert" : "Take clinical action"}
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  {noteFlow.alert.title} | {noteFlow.alert.body}
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
                  Add the clinical note for this vital alert. Resolved alerts leave the queue; actioned alerts remain visible until resolved.
                </div>
              </div>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder={
                  noteFlow.status === "resolved"
                    ? "Example: Reviewed repeat vitals. Values returned to acceptable range; no further action required."
                    : "Example: Contacted patient, adjusted monitoring plan, and scheduled follow-up within 48 hours."
                }
                className="w-full bg-field border border-field-border rounded-xl px-3 py-2.5 text-[11px] text-ink placeholder:text-dim outline-none focus:border-[#38bdf8] resize-none transition-colors"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="text-[9px] text-dim">Note is required to update the alert.</div>
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
                      noteFlow.status === "resolved"
                        ? "bg-success/15 text-success border-success/25 hover:bg-success/25"
                        : "bg-warning/15 text-warning border-warning/25 hover:bg-warning/25",
                      !note.trim() && "opacity-45 cursor-not-allowed"
                    )}
                  >
                    {noteFlow.status === "resolved" ? "Save & Resolve" : "Save Action"}
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

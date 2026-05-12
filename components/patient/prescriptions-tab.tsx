"use client";

import { patientData } from "@/lib/data/patients";
import { cn } from "@/lib/utils";
import { Pill, FlaskConical, UserRound, Upload, RefreshCw } from "lucide-react";

interface PrescriptionsTabProps {
  patientId: string;
}

const ITEM_ICON = {
  medication: Pill,
  lab: FlaskConical,
  referral: UserRound,
};

const ITEM_COLOR: Record<string, string> = {
  medication: "bg-blue-500/10 text-blue-400",
  lab: "bg-warning/10 text-warning",
  referral: "bg-violet/10 text-[#8B5CF6]",
};

const ITEM_STATUS: Record<string, string> = {
  filled:    "bg-success/10 text-success border-success/25",
  completed: "bg-success/10 text-success border-success/25",
  pending:   "bg-warning/10 text-warning border-warning/25",
  ordered:   "bg-blue-500/10 text-blue-400 border-blue-500/25",
  cancelled: "bg-white/5 text-dim border-white/10",
};

const RX_STATUS: Record<string, string> = {
  active:    "bg-success/10 text-success border-success/25",
  completed: "bg-white/5 text-dim border-white/10",
  expired:   "bg-danger/10 text-danger border-danger/25",
};

export function PrescriptionsTab({ patientId }: PrescriptionsTabProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  const { prescriptions } = patient;

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-dim text-[12px]">
        No prescriptions on record
      </div>
    );
  }

  const active = prescriptions.filter((r) => r.status === "active").length;
  const synced = prescriptions.filter((r) => r.source === "sync").length;
  const pendingItems = prescriptions
    .flatMap((r) => r.items)
    .filter((i) => i.status === "pending" || i.status === "ordered").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-5 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Total Rx</div>
            <div className="text-xl font-bold text-ink">{prescriptions.length}</div>
          </div>
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Active</div>
            <div className={cn("text-xl font-bold", active > 0 ? "text-success" : "text-muted")}>{active}</div>
          </div>
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Pending</div>
            <div className={cn("text-xl font-bold", pendingItems > 0 ? "text-warning" : "text-success")}>{pendingItems}</div>
          </div>
          <div className="glass-card p-3">
            <div className="text-[9px] font-bold text-dim uppercase tracking-wider mb-1">Synced</div>
            <div className="text-xl font-bold text-blue-400">{synced}</div>
          </div>
        </div>

        {/* Prescription cards */}
        {prescriptions.map((rx) => {
          const SourceIcon = rx.source === "sync" ? RefreshCw : Upload;
          return (
            <div key={rx.id} className="glass-card overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-glass-border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-bold text-ink">{rx.doctor}</span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-dim border border-white/10 flex-shrink-0">
                      {rx.specialty}
                    </span>
                  </div>
                  <div className="text-[10px] text-dim mt-0.5 truncate">{rx.clinic} · {rx.date}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border",
                      rx.source === "sync"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
                        : "bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border-[rgba(139,92,246,0.25)]"
                    )}
                  >
                    <SourceIcon size={8} />
                    {rx.source === "sync" ? "Synced" : "Uploaded"}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize",
                      RX_STATUS[rx.status]
                    )}
                  >
                    {rx.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {rx.items.map((item, i) => {
                  const ItemIcon = ITEM_ICON[item.type];
                  return (
                    <div key={i} className="flex items-start gap-3 px-4 py-3">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          ITEM_COLOR[item.type]
                        )}
                      >
                        <ItemIcon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-muted flex-1 min-w-0 break-words">
                            {item.name}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold border flex-shrink-0 capitalize",
                              ITEM_STATUS[item.status] ?? "bg-white/5 text-dim border-white/10"
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                        {(item.dosage || item.duration) && (
                          <div className="text-[10px] text-dim mt-0.5">
                            {[item.dosage, item.duration].filter(Boolean).join(" · ")}
                          </div>
                        )}
                        {item.instructions && (
                          <div className="text-[10px] text-[#38bdf8] mt-0.5">{item.instructions}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Doctor notes */}
              {rx.notes && (
                <div className="px-4 py-3 border-t border-glass-border bg-white/[0.015]">
                  <span className="text-[9px] font-bold text-dim uppercase tracking-wider">Dr. Notes · </span>
                  <span className="text-[10px] text-muted">{rx.notes}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Upload prompt */}
        <div className="glass-card p-4 border-dashed flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-muted">Have a paper prescription?</div>
            <div className="text-[10px] text-dim mt-0.5">Upload a photo or PDF to add it to this record</div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[rgba(56,189,248,0.12)] text-[#38bdf8] border border-[rgba(56,189,248,0.25)] hover:bg-[rgba(56,189,248,0.22)] transition-all flex-shrink-0">
            <Upload size={11} />
            Upload Rx
          </button>
        </div>
      </div>
    </div>
  );
}

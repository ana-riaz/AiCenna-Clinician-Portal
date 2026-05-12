"use client";

import { useApp } from "@/lib/context/app-context";
import { cn, formatRelativeTime } from "@/lib/utils";
import { AlertTriangle, AlertCircle, FileText, FlaskConical, X, Check } from "lucide-react";
import { Alert } from "@/lib/types";

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function getIcon(alert: Alert) {
  if (alert.type === "summary") return <FileText size={12} />;
  if (alert.type === "lab") return <FlaskConical size={12} />;
  if (alert.severity === "critical") return <AlertTriangle size={12} />;
  return <AlertCircle size={12} />;
}

export function AlertsPanel({ isOpen, onClose }: AlertsPanelProps) {
  const { alerts, markAlertRead, markAllAlertsRead, handleAlertClick } = useApp();

  if (!isOpen) return null;

  const panelAlerts = alerts.filter((a) => a.panel);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-[rgba(8,18,37,0.98)] border-l border-glass-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-danger" />
            <span className="text-[12px] font-bold text-ink">Alerts</span>
            {panelAlerts.filter((a) => !a.read).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-danger text-white">
                {panelAlerts.filter((a) => !a.read).length}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={markAllAlertsRead}
              className="text-[10px] text-dim hover:text-muted px-2 py-1 rounded transition-colors"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 text-dim hover:text-muted transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto">
          {panelAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-dim text-[11px]">
              No active alerts
            </div>
          ) : (
            panelAlerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => {
                  handleAlertClick(alert);
                  onClose();
                }}
                className={cn(
                  "relative w-full text-left p-3 pl-4 border-b border-glass-border flex gap-2.5 hover:bg-white/[0.03] transition-colors",
                  !alert.read && "bg-gradient-to-r from-[rgba(56,189,248,0.04)] to-transparent"
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-0.5 rounded-r-sm",
                    alert.severity === "critical" ? "bg-danger" : alert.severity === "warning" ? "bg-warning" : "bg-success"
                  )}
                />
                <div
                  className={cn(
                    "w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 text-[11px]",
                    alert.type === "summary"
                      ? "bg-success/12 text-success"
                      : alert.type === "lab"
                      ? "bg-blue-500/12 text-blue-400"
                      : alert.severity === "critical"
                      ? "bg-danger/12 text-danger"
                      : "bg-warning/12 text-warning"
                  )}
                >
                  {getIcon(alert)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-ink leading-tight mb-0.5">{alert.title}</div>
                  <div className="text-[10px] text-muted leading-snug">{alert.body}</div>
                  <div className="text-[9px] text-dim mt-1">{formatRelativeTime(alert.time)}</div>
                </div>
                {!alert.read && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      markAlertRead(alert.id);
                    }}
                    className="flex-shrink-0 p-1 text-dim hover:text-success transition-colors mt-0.5 cursor-pointer"
                    title="Mark read"
                  >
                    <Check size={10} />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

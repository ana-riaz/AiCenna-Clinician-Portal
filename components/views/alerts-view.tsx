"use client";

import { useState } from "react";
import { useApp } from "@/lib/context/app-context";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  AlertTriangle,
  AlertCircle,
  FileText,
  FlaskConical,
  Check,
  CheckCheck,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Alert } from "@/lib/types";

type AlertFilter = "all" | "critical" | "warning" | "unread";
type AlertGroup = "severity" | "patient";

function getAlertIcon(alert: Alert) {
  if (alert.type === "summary") return <FileText size={12} />;
  if (alert.type === "lab") return <FlaskConical size={12} />;
  if (alert.severity === "critical") return <AlertTriangle size={12} />;
  return <AlertCircle size={12} />;
}

function getAlertIconClass(alert: Alert) {
  if (alert.type === "summary") return "bg-success/12 text-success";
  if (alert.type === "lab") return "bg-[#38bdf8]/12 text-[#38bdf8]";
  if (alert.severity === "critical") return "bg-danger/12 text-danger";
  return "bg-warning/12 text-warning";
}

function getIndicatorClass(alert: Alert) {
  if (alert.severity === "critical") return "bg-danger";
  if (alert.severity === "warning") return "bg-warning";
  return "bg-success";
}

export function AlertsView() {
  const { alerts, markAlertRead, markAllAlertsRead, clearAlerts, handleAlertClick } = useApp();
  const [filter, setFilter] = useState<AlertFilter>("all");
  const [groupBy, setGroupBy] = useState<AlertGroup>("severity");
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  // Filter panel alerts only
  const panelAlerts = alerts.filter((a) => a.panel);

  const criticalAlerts = panelAlerts.filter((a) => a.severity === "critical");
  const warningAlerts = panelAlerts.filter((a) => a.severity === "warning");
  const unreadCount = panelAlerts.filter((a) => !a.read).length;
  const totalAlerts = panelAlerts.length;

  // Filter alerts based on current filter
  const getFilteredAlerts = (alertsToFilter: Alert[]) => {
    switch (filter) {
      case "critical":
        return alertsToFilter.filter((a) => a.severity === "critical");
      case "warning":
        return alertsToFilter.filter((a) => a.severity === "warning");
      case "unread":
        return alertsToFilter.filter((a) => !a.read);
      default:
        return alertsToFilter;
    }
  };

  const renderAlertRow = (alert: Alert) => (
    <button
      key={alert.id}
      onClick={() => handleAlertClick(alert)}
      className={cn(
        "relative w-full text-left p-2.5 pl-3.5 border-b border-[rgba(255,255,255,0.05)] cursor-pointer transition-all flex gap-2.5 hover:bg-[rgba(255,255,255,0.03)]",
        !alert.read && "bg-gradient-to-r from-[rgba(56,189,248,0.04)] to-transparent"
      )}
    >
      {/* Indicator */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-0.5 rounded-r-sm opacity-90", getIndicatorClass(alert))} />

      {/* Icon */}
      <div className={cn("w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0", getAlertIconClass(alert))}>
        {getAlertIcon(alert)}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={cn(
              "text-[8px] font-bold uppercase tracking-wide py-0.5 px-1.5 rounded-sm",
              alert.severity === "critical" && "bg-danger/15 text-danger",
              alert.severity === "warning" && "bg-warning/15 text-warning",
              alert.severity === "info" && "bg-success/12 text-success"
            )}
          >
            {alert.severity}
          </span>
          <span className="text-[9px] text-dim font-medium">{formatRelativeTime(alert.time)}</span>
        </div>
        <div className="text-[11px] font-semibold mb-0.5 text-ink leading-tight">{alert.title}</div>
        <div className="text-[10px] text-muted leading-snug">{alert.body}</div>
      </div>

      {/* Side */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
        {!alert.read && <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full flex-shrink-0" />}
        <button
          onClick={(e) => {
            e.stopPropagation();
            markAlertRead(alert.id);
          }}
          className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-dim cursor-pointer p-1 rounded hover:bg-[rgba(16,185,129,0.15)] hover:border-[rgba(16,185,129,0.25)] hover:text-success transition-all"
          title="Mark read"
        >
          <Check size={10} />
        </button>
      </div>
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-ink mb-0.5">Alert Center</h1>
          <p className="text-[11px] text-muted">
            {totalAlerts} active alert{totalAlerts !== 1 ? "s" : ""} requiring attention
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={markAllAlertsRead}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-md text-[10px] font-semibold cursor-pointer border border-transparent bg-[rgba(255,255,255,0.06)] text-muted hover:bg-[rgba(255,255,255,0.1)] hover:text-ink transition-all"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
          <button
            onClick={clearAlerts}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-md text-[10px] font-semibold cursor-pointer border border-transparent bg-[rgba(255,255,255,0.06)] text-muted hover:bg-[rgba(255,255,255,0.1)] hover:text-ink transition-all"
          >
            <Trash2 size={14} />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-3 relative overflow-hidden border-t-2 border-t-danger hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-danger/12 text-danger mb-2">
            <AlertTriangle size={14} />
          </div>
          <div className="font-mono text-xl font-bold text-danger leading-none">
            {criticalAlerts.filter((a) => !a.read).length}
          </div>
          <div className="text-[9px] text-muted font-medium uppercase tracking-wide mt-0.5">
            Critical Alerts
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-full bg-gradient-to-r from-danger to-danger/70"
              style={{
                width: totalAlerts
                  ? `${(criticalAlerts.filter((a) => !a.read).length / totalAlerts) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-3 relative overflow-hidden border-t-2 border-t-warning hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-warning/12 text-warning mb-2">
            <AlertCircle size={14} />
          </div>
          <div className="font-mono text-xl font-bold text-warning leading-none">
            {warningAlerts.filter((a) => !a.read).length}
          </div>
          <div className="text-[9px] text-muted font-medium uppercase tracking-wide mt-0.5">Warnings</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-full bg-gradient-to-r from-warning to-warning/70"
              style={{
                width: totalAlerts
                  ? `${(warningAlerts.filter((a) => !a.read).length / totalAlerts) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-3 relative overflow-hidden border-t-2 border-t-[#38bdf8] hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <div className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-[#38bdf8]/12 text-[#38bdf8] mb-2">
            <FileText size={14} />
          </div>
          <div className="font-mono text-xl font-bold text-[#38bdf8] leading-none">{unreadCount}</div>
          <div className="text-[9px] text-muted font-medium uppercase tracking-wide mt-0.5">Unread</div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]"
              style={{
                width: totalAlerts ? `${(unreadCount / totalAlerts) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 px-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg">
        <div className="flex gap-1.5">
          {/* Filter Dropdown */}
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
                {(["all", "critical", "warning", "unread"] as AlertFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setFilterOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-xs hover:bg-glass transition-colors capitalize",
                      filter === f && "text-[#38bdf8] bg-[rgba(56,189,248,0.1)]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Group Dropdown */}
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
                {(["severity", "patient"] as AlertGroup[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGroupBy(g);
                      setGroupOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-xs hover:bg-glass transition-colors capitalize",
                      groupBy === g && "text-[#38bdf8] bg-[rgba(56,189,248,0.1)]"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {groupBy === "severity" ? (
        <>
          {(filter === "all" || filter === "critical" || filter === "unread") &&
            getFilteredAlerts(criticalAlerts).length > 0 && (
              <div className="glass-card overflow-hidden mb-2.5">
                {getFilteredAlerts(criticalAlerts).map(renderAlertRow)}
              </div>
            )}
          {(filter === "all" || filter === "warning" || filter === "unread") &&
            getFilteredAlerts(warningAlerts).length > 0 && (
              <div className="glass-card overflow-hidden mb-2.5">
                {getFilteredAlerts(warningAlerts).map(renderAlertRow)}
              </div>
            )}
        </>
      ) : (
        // Group by patient
        <div className="flex flex-col gap-2.5">
          {(() => {
            const byPatient: Record<string, Alert[]> = {};
            getFilteredAlerts(panelAlerts.filter((a) => a.severity !== "info")).forEach((a) => {
              if (!byPatient[a.patId]) byPatient[a.patId] = [];
              byPatient[a.patId].push(a);
            });
            return Object.entries(byPatient).map(([patId, patientAlerts]) => (
              <div key={patId} className="glass-card overflow-hidden">
                {patientAlerts.map(renderAlertRow)}
              </div>
            ));
          })()}
        </div>
      )}

      {/* Empty State */}
      {getFilteredAlerts(panelAlerts).length === 0 && (
        <div className="text-center text-dim text-sm py-16 bg-[rgba(255,255,255,0.02)] border border-dashed border-[rgba(255,255,255,0.1)] rounded-[14px]">
          No alerts match this filter
        </div>
      )}
    </div>
  );
}

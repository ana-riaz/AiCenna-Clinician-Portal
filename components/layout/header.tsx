"use client";

import { ReactNode, useState } from "react";
import { Bell, Search, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { AlertTriangle, AlertCircle, FileText, FlaskConical, Check } from "lucide-react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backLabel?: string;
  onBack?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onMarkAllRead: () => void;
  patientHeaderContent?: ReactNode;
}

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

export function Header({
  title,
  showBack,
  backLabel = "Back",
  onBack,
  searchQuery,
  onSearchChange,
  alerts,
  onAlertClick,
  onMarkAllRead,
  patientHeaderContent,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const unreadCount = alerts.filter((a) => !a.read).length;
  const showSearchInput = searchOpen || !!searchQuery;

  return (
    <header className="h-[58px] bg-[rgba(8,18,37,0.6)] backdrop-blur-[20px] border-b border-glass-border flex items-center px-4 gap-3 flex-shrink-0 relative z-20">
      {/* Back Button */}
      {showBack && (
        <button
          onClick={onBack}
          className="h-[34px] w-[28px] flex items-center justify-center text-muted cursor-pointer transition-colors hover:text-[#38bdf8] flex-shrink-0"
          title={backLabel}
        >
          <ArrowLeft size={14} />
        </button>
      )}

      {patientHeaderContent}

      {/* Title */}
      {!showBack && !patientHeaderContent && (
        <h1 className="text-[15px] font-extrabold tracking-tight flex-1 bg-gradient-to-r from-ink to-muted bg-clip-text text-transparent">
          {title}
        </h1>
      )}

      {/* Search */}
      <div className="ml-auto flex items-center flex-shrink-0">
        {showSearchInput ? (
          <div className="flex items-center gap-2 bg-field border border-field-border rounded-xl py-1.5 px-3 w-[190px]">
            <Search size={13} className="text-dim" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setSearchOpen(false);
              }}
              autoFocus={searchOpen}
              className="bg-transparent border-none outline-none text-ink font-sans text-xs w-full placeholder:text-dim"
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="w-[34px] h-[34px] bg-glass border border-glass-border rounded-[10px] cursor-pointer flex items-center justify-center text-muted transition-all hover:border-[#38bdf8] hover:text-[#38bdf8]"
            title="Search"
          >
            <Search size={15} />
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative group">
        <button className="w-[34px] h-[34px] bg-glass border border-glass-border rounded-[10px] cursor-pointer flex items-center justify-center text-muted text-sm transition-all hover:border-[#38bdf8] hover:text-[#38bdf8] relative">
          <Bell size={15} />
          {unreadCount > 0 && (
            <div className="absolute top-[5px] right-[5px] w-[7px] h-[7px] bg-danger rounded-full border-[1.5px] border-navy" />
          )}
        </button>

        {/* Dropdown */}
        <div className="absolute top-[calc(100%+8px)] right-0 w-[320px] bg-[rgba(8,18,37,0.95)] backdrop-blur-[20px] border border-glass-border rounded-2xl z-50 shadow-[0_20px_60px_rgba(0,0,0,0.5)] hidden group-hover:block">
          <div className="p-3.5 border-b border-glass-border flex items-center justify-between">
            <span className="text-xs font-bold">Notifications</span>
            <button
              onClick={onMarkAllRead}
              className="text-[10px] text-[#38bdf8] cursor-pointer hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {alerts.slice(0, 8).map((alert) => (
              <button
                key={alert.id}
                onClick={() => onAlertClick(alert)}
                className={cn(
                  "relative w-full text-left p-2.5 pl-3.5 border-b border-[rgba(255,255,255,0.05)] cursor-pointer transition-all flex gap-2.5 hover:bg-[rgba(255,255,255,0.03)]",
                  !alert.read && "bg-gradient-to-r from-[rgba(56,189,248,0.04)] to-transparent"
                )}
              >
                {/* Indicator */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-0.5 rounded-r-sm opacity-90",
                    alert.severity === "critical" && "bg-danger",
                    alert.severity === "warning" && "bg-warning",
                    alert.severity === "info" && "bg-success"
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0",
                    getAlertIconClass(alert)
                  )}
                >
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
                    <span className="text-[9px] text-dim font-medium">
                      {formatRelativeTime(alert.time)}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold mb-0.5 text-ink leading-tight">
                    {alert.title}
                  </div>
                  <div className="text-[10px] text-muted leading-snug">{alert.body}</div>
                </div>

                {/* Side */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                  {!alert.read && (
                    <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
            {alerts.length === 0 && (
              <div className="py-8 px-4 text-[11px] text-dim text-center">
                No new notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useApp } from "@/lib/context/app-context";
import { AlertTriangle, X, Clock, User, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsPanel({ isOpen, onClose }: AlertsPanelProps) {
  const { alerts, dismissAlert, selectPatient, setCurrentView } = useApp();

  const handleAlertClick = (alert: (typeof alerts)[0]) => {
    // Find the patient and navigate to them
    selectPatient(alert.patientId);
    setCurrentView("patient");
    onClose();
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-red-500 bg-red-500/5";
      case "warning":
        return "border-l-amber-500 bg-amber-500/5";
      default:
        return "border-l-blue-500 bg-blue-500/5";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/30">
            Critical
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-500 border border-amber-500/30">
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-500 border border-blue-500/30">
            Info
          </span>
        );
    }
  };

  if (!isOpen) return null;

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const dismissedAlerts = alerts.filter((a) => a.dismissed);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
            {activeAlerts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No active alerts</p>
              <p className="text-sm">All patients are stable</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Active Alerts ({activeAlerts.length})
              </h3>
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`relative rounded-lg border-l-4 border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors ${getSeverityStyles(
                    alert.severity
                  )}`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {alert.type}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-medium text-foreground mb-2">{alert.message}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {alert.patientName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(alert.timestamp)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dismissed Alerts */}
          {dismissedAlerts.length > 0 && (
            <div className="p-4 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Dismissed ({dismissedAlerts.length})
              </h3>
              <div className="space-y-2 opacity-50">
                {dismissedAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-lg border border-border p-3 text-sm"
                  >
                    <p className="text-muted-foreground line-through">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.patientName} - {formatDistanceToNow(alert.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

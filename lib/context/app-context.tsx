"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
  Alert,
  AlertCaseStatus,
  AlertCaseUpdate,
  LabCaseStatus,
  LabCaseUpdate,
  ViewType,
  PatientTab,
  RiskFilter,
  SortOption,
  VitalFilter,
  VITAL_META,
  RISK_ORDER,
} from "@/lib/types";
import { patientData, getAllPatients } from "@/lib/data/patients";

interface AppState {
  // Navigation
  currentView: ViewType;
  currentPatient: string | null;
  currentTab: PatientTab;
  backTo: ViewType;

  // Search
  searchQuery: string;

  // Filters
  riskFilter: RiskFilter;
  sortOption: SortOption;
  vitalFilter: VitalFilter;

  // Alerts
  alerts: Alert[];
  alertCaseUpdates: Record<string, AlertCaseUpdate>;

  // Summary verification state
  summaryVerified: Record<string, boolean>;

  // Lab case workflow state
  labCaseUpdates: Record<string, LabCaseUpdate>;
}

interface AppContextValue extends AppState {
  // Navigation actions
  showDashboard: () => void;
  showPatients: () => void;
  showAlerts: () => void;
  showLabs: () => void;
  showAppointments: () => void;
  openPatient: (id: string, tab?: PatientTab, backTo?: ViewType) => void;
  goBack: () => void;
  switchTab: (tab: PatientTab) => void;

  // Search
  setSearchQuery: (query: string) => void;

  // Filters
  setRiskFilter: (filter: RiskFilter) => void;
  setSortOption: (option: SortOption) => void;
  setVitalFilter: (filter: VitalFilter) => void;

  // Alerts
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  clearAlerts: () => void;
  handleAlertClick: (alert: Alert) => void;
  updateAlertCase: (alertId: string, status: AlertCaseStatus, note: string) => void;

  // Summary
  verifySummary: (patientId: string) => void;

  // Lab cases
  updateLabCase: (caseId: string, status: LabCaseStatus, note: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

let alertIdCounter = 0;
function generateAlertId() {
  return `a${++alertIdCounter}`;
}

function buildInitialAlerts(): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();
  const vOrder = ["spo2", "hr", "bp", "glucose", "hrv", "sleep", "stress", "rem", "recovery"];

  Object.entries(patientData).forEach(([patId, patient]) => {
    let criticalCount = 0;
    let warningCount = 0;

    vOrder.forEach((key) => {
      const vital = patient.vitals[key];
      const meta = VITAL_META.find((m) => m.key === key);
      if (!vital || !meta) return;

      if (vital.tc === "c" && criticalCount < 2) {
        criticalCount++;
        alerts.push({
          id: generateAlertId(),
          patId,
          type: "vital",
          vital: key,
          severity: "critical",
          title: `${patient.name.split(" ")[0]} — ${meta.label}`,
          body: `${vital.val}${vital.unit || ""} · ${vital.trend.replace(/^[↑↓→]\s*/, "")}`,
          time: now - (2 + Math.floor(Math.random() * 10)) * 60000,
          read: false,
          panel: true,
        });
      } else if (vital.tc === "e" && warningCount < 1) {
        warningCount++;
        alerts.push({
          id: generateAlertId(),
          patId,
          type: "vital",
          vital: key,
          severity: "warning",
          title: `${patient.name.split(" ")[0]} — ${meta.label} Elevated`,
          body: `${vital.val}${vital.unit || ""}`,
          time: now - (20 + Math.floor(Math.random() * 30)) * 60000,
          read: false,
          panel: true,
        });
      }
    });

    // Historical lab issues stay in the Lab Reports queue; notification alerts
    // should only be created when a new report is added.
    let labAlertAdded = true;
    patient.labs.forEach((lab) => {
      if (labAlertAdded) return;
      const flaggedRow = lab.rows.find((r) => r.flag === "CRITICAL");
      if (flaggedRow) {
        labAlertAdded = true;
        alerts.push({
          id: generateAlertId(),
          patId,
          type: "lab",
          severity: "critical",
          title: `${patient.name.split(" ")[0]} — Lab Critical`,
          body: `${flaggedRow.test} ${flaggedRow.val} in ${lab.name}`,
          time: now - 18 * 60000,
          read: false,
          panel: true,
        });
      }
    });

    // Summary alert
    alerts.push({
      id: generateAlertId(),
      patId,
      type: "summary",
      severity: "info",
      title: `Summary ready — ${patient.name.split(" ")[0]} ${patient.name.split(" ")[1][0]}.`,
      body: "Awaiting verification",
      time: now - (60 + Math.floor(Math.random() * 60)) * 60000,
      read: false,
      panel: false,
    });
  });

  const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  return alerts.sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] || b.time - a.time
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentView: "dash",
    currentPatient: null,
    currentTab: "ov",
    backTo: "dash",
    searchQuery: "",
    riskFilter: "all",
    sortOption: "risk",
    vitalFilter: "7d",
    alerts: [],
    alertCaseUpdates: {},
    summaryVerified: {},
    labCaseUpdates: {},
  });

  // Initialize alerts on client side
  useEffect(() => {
    setState((prev) => ({ ...prev, alerts: buildInitialAlerts() }));
  }, []);

  // Navigation actions
  const showDashboard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: "dash",
      currentPatient: null,
      searchQuery: "",
    }));
  }, []);

  const showPatients = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: "patients",
      currentPatient: null,
      searchQuery: "",
    }));
  }, []);

  const showAlerts = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: "alerts",
      currentPatient: null,
      searchQuery: "",
    }));
  }, []);

  const showLabs = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: "labs",
      currentPatient: null,
      searchQuery: "",
    }));
  }, []);

  const showAppointments = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: "appointments",
      currentPatient: null,
      searchQuery: "",
    }));
  }, []);

  const openPatient = useCallback(
    (id: string, tab: PatientTab = "ov", backTo: ViewType = "dash") => {
      setState((prev) => ({
        ...prev,
        currentView: "dash", // Patient view is rendered separately
        currentPatient: id,
        currentTab: tab,
        backTo,
        vitalFilter: "7d",
      }));
    },
    []
  );

  const goBack = useCallback(() => {
    setState((prev) => {
      const { backTo } = prev;
      return {
        ...prev,
        currentPatient: null,
        currentView: backTo,
      };
    });
  }, []);

  const switchTab = useCallback((tab: PatientTab) => {
    setState((prev) => ({ ...prev, currentTab: tab }));
  }, []);

  // Search
  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => {
      // If search is entered and not on patients view, go to patients
      if (query && prev.currentView !== "patients" && !prev.currentPatient) {
        return { ...prev, searchQuery: query, currentView: "patients" };
      }
      return { ...prev, searchQuery: query };
    });
  }, []);

  // Filters
  const setRiskFilter = useCallback((filter: RiskFilter) => {
    setState((prev) => ({ ...prev, riskFilter: filter }));
  }, []);

  const setSortOption = useCallback((option: SortOption) => {
    setState((prev) => ({ ...prev, sortOption: option }));
  }, []);

  const setVitalFilter = useCallback((filter: VitalFilter) => {
    setState((prev) => ({ ...prev, vitalFilter: filter }));
  }, []);

  // Alerts
  const markAlertRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    }));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => ({ ...a, read: true })),
    }));
  }, []);

  const clearAlerts = useCallback(() => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => !a.panel),
    }));
  }, []);

  const handleAlertClick = useCallback((alert: Alert) => {
    setState((prev) => {
      const tab: PatientTab =
        alert.type === "lab" ? "labs" : alert.type === "summary" ? "ov" : "ov";
      const backTo: ViewType = alert.panel
        ? "alerts"
        : prev.currentPatient
          ? prev.backTo
          : prev.currentView;

      return {
        ...prev,
        alerts: prev.alerts.map((a) =>
          a.id === alert.id ? { ...a, read: true } : a
        ),
        currentPatient: alert.patId,
        currentTab: tab,
        backTo,
      };
    });
  }, []);

  const updateAlertCase = useCallback((alertId: string, status: AlertCaseStatus, note: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      ),
      alertCaseUpdates: {
        ...prev.alertCaseUpdates,
        [alertId]: {
          status,
          note,
          updatedAt: Date.now(),
        },
      },
    }));
  }, []);

  // Summary
  const verifySummary = useCallback((patientId: string) => {
    setState((prev) => ({
      ...prev,
      summaryVerified: { ...prev.summaryVerified, [patientId]: true },
    }));
  }, []);

  const updateLabCase = useCallback((caseId: string, status: LabCaseStatus, note: string) => {
    setState((prev) => ({
      ...prev,
      labCaseUpdates: {
        ...prev.labCaseUpdates,
        [caseId]: {
          status,
          note,
          updatedAt: Date.now(),
        },
      },
    }));
  }, []);

  const value: AppContextValue = {
    ...state,
    showDashboard,
    showPatients,
    showAlerts,
    showLabs,
    showAppointments,
    openPatient,
    goBack,
    switchTab,
    setSearchQuery,
    setRiskFilter,
    setSortOption,
    setVitalFilter,
    markAlertRead,
    markAllAlertsRead,
    clearAlerts,
    handleAlertClick,
    updateAlertCase,
    verifySummary,
    updateLabCase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

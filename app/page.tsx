"use client";

import { useState, useEffect } from "react";
import { AppProvider, useApp } from "@/lib/context/app-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DashboardView } from "@/components/views/dashboard-view";
import { PatientsView } from "@/components/views/patients-view";
import { SummariesView } from "@/components/views/summaries-view";
import { AlertsView } from "@/components/views/alerts-view";
import { LabsView } from "@/components/views/labs-view";
import { AppointmentsView } from "@/components/views/appointments-view";
import { PatientHeaderControls, PatientView } from "@/components/views/patient-view";
import { patientData } from "@/lib/data/patients";

function AppShell() {
  const {
    currentView,
    currentPatient,
    backTo,
    searchQuery,
    alerts,
    alertCaseUpdates,
    showDashboard,
    showPatients,
    showSummaries,
    showAlerts,
    showLabs,
    showAppointments,
    goBack,
    setSearchQuery,
    handleAlertClick,
    markAllAlertsRead,
  } = useApp();

  const handleNavChange = (nav: string) => {
    switch (nav) {
      case "dash":     showDashboard(); break;
      case "patients": showPatients();  break;
      case "summaries": showSummaries(); break;
      case "alerts":   showAlerts();    break;
      case "labs":     showLabs();      break;
      case "appointments": showAppointments(); break;
    }
  };

  const alertCount = alerts.filter(
    (a) =>
      a.panel &&
      a.type === "vital" &&
      !a.read &&
      alertCaseUpdates[a.id]?.status !== "resolved"
  ).length;

  const getTitle = () => {
    if (currentPatient) return patientData[currentPatient]?.name || "Patient";
    switch (currentView) {
      case "dash":     return "Dashboard";
      case "patients": return "My Patients";
      case "summaries": return "Pending Summaries";
      case "alerts":   return "Active Alerts";
      case "labs":     return "Lab Reports";
      case "appointments": return "Appointments";
      default:         return "Dashboard";
    }
  };

  const getBackLabel = () => {
    const labels: Record<string, string> = {
      dash:     "Dashboard",
      patients: "My Patients",
      summaries: "Pending Summaries",
      alerts:   "Alerts",
      labs:     "Lab Reports",
      appointments: "Appointments",
    };
    return labels[backTo] || "Back";
  };

  const notificationAlerts = alerts.filter((a) => !a.panel);

  return (
    <div className="flex h-screen relative z-[1]">
      <Sidebar
        activeNav={currentPatient ? null : currentView}
        onNavChange={handleNavChange}
        alertCount={alertCount}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={getTitle()}
          showBack={!!currentPatient}
          backLabel={getBackLabel()}
          onBack={goBack}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alerts={notificationAlerts}
          onAlertClick={handleAlertClick}
          onMarkAllRead={markAllAlertsRead}
          patientHeaderContent={currentPatient ? <PatientHeaderControls patientId={currentPatient} /> : undefined}
        />

        <div className="flex-1 overflow-hidden flex">
          {currentPatient ? (
            <PatientView patientId={currentPatient} />
          ) : (
            <>
              {currentView === "dash"     && <DashboardView />}
              {currentView === "patients" && <PatientsView />}
              {currentView === "summaries" && <SummariesView />}
              {currentView === "alerts"   && <AlertsView />}
              {currentView === "labs"     && <LabsView />}
              {currentView === "appointments" && <AppointmentsView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

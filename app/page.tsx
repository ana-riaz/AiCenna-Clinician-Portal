"use client";

import { AppProvider, useApp } from "@/lib/context/app-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DashboardView } from "@/components/views/dashboard-view";
import { PatientsView } from "@/components/views/patients-view";
import { AlertsView } from "@/components/views/alerts-view";
import { LabsView } from "@/components/views/labs-view";
import { PatientView } from "@/components/views/patient-view";
import { patientData } from "@/lib/data/patients";

function AppShell() {
  const {
    currentView,
    currentPatient,
    backTo,
    searchQuery,
    alerts,
    showDashboard,
    showPatients,
    showAlerts,
    showLabs,
    goBack,
    setSearchQuery,
    handleAlertClick,
    markAllAlertsRead,
  } = useApp();

  const handleNavChange = (nav: string) => {
    switch (nav) {
      case "dash":
        showDashboard();
        break;
      case "patients":
        showPatients();
        break;
      case "alerts":
        showAlerts();
        break;
      case "labs":
        showLabs();
        break;
    }
  };

  const alertCount = alerts.filter((a) => !a.read && a.severity !== "info").length;

  const getTitle = () => {
    if (currentPatient) {
      return patientData[currentPatient]?.name || "Patient";
    }
    switch (currentView) {
      case "dash":
        return "Dashboard";
      case "patients":
        return "My Patients";
      case "alerts":
        return "Active Alerts";
      case "labs":
        return "Lab Reports";
      default:
        return "Dashboard";
    }
  };

  const getBackLabel = () => {
    const labels: Record<string, string> = {
      dash: "Dashboard",
      patients: "My Patients",
      alerts: "Alerts",
      labs: "Lab Reports",
    };
    return labels[backTo] || "Back";
  };

  // Filter notifications for header (non-panel alerts)
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
        />

        <div className="flex-1 overflow-hidden flex">
          {currentPatient ? (
            <PatientView patientId={currentPatient} />
          ) : (
            <>
              {currentView === "dash" && <DashboardView />}
              {currentView === "patients" && <PatientsView />}
              {currentView === "alerts" && <AlertsView />}
              {currentView === "labs" && <LabsView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

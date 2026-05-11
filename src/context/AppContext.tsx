'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Alert, AlertFilter, AlertGroupBy } from '@/types';
import { initialAlerts } from '@/data/alerts';

interface AppContextType {
  // Alerts
  alerts: Alert[];
  unreadCount: number;
  criticalCount: number;
  warningCount: number;
  alertFilter: AlertFilter;
  alertGroupBy: AlertGroupBy;
  setAlertFilter: (filter: AlertFilter) => void;
  setAlertGroupBy: (groupBy: AlertGroupBy) => void;
  markAlertRead: (id: string) => void;
  markAllRead: () => void;
  clearAlerts: () => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  notificationOpen: boolean;
  toggleNotification: () => void;
  closeNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Alerts state
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [alertFilter, setAlertFilter] = useState<AlertFilter>('all');
  const [alertGroupBy, setAlertGroupBy] = useState<AlertGroupBy>('severity');
  
  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Computed values
  const unreadCount = useMemo(() => alerts.filter(a => a.panel && !a.read).length, [alerts]);
  const criticalCount = useMemo(() => alerts.filter(a => a.panel && !a.read && a.severity === 'critical').length, [alerts]);
  const warningCount = useMemo(() => alerts.filter(a => a.panel && !a.read && a.severity === 'warning').length, [alerts]);

  // Alert actions
  const markAlertRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const markAllRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(a => !a.panel));
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `a${Date.now()}`
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  // UI actions
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleNotification = useCallback(() => {
    setNotificationOpen(prev => !prev);
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationOpen(false);
  }, []);

  const value = useMemo(() => ({
    alerts,
    unreadCount,
    criticalCount,
    warningCount,
    alertFilter,
    alertGroupBy,
    setAlertFilter,
    setAlertGroupBy,
    markAlertRead,
    markAllRead,
    clearAlerts,
    addAlert,
    sidebarCollapsed,
    toggleSidebar,
    notificationOpen,
    toggleNotification,
    closeNotification
  }), [
    alerts, unreadCount, criticalCount, warningCount, alertFilter, alertGroupBy,
    markAlertRead, markAllRead, clearAlerts, addAlert,
    sidebarCollapsed, toggleSidebar, notificationOpen, toggleNotification, closeNotification
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

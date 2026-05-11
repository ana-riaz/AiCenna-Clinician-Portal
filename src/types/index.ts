// Patient types
export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  condition: string;
  status: 'stable' | 'critical' | 'improving' | 'declining';
  room: string;
  admitDate: string;
  photo?: string;
  vitals: Vitals;
  medications: Medication[];
  labs: LabResult[];
  notes: Note[];
  timeline: TimelineEvent[];
  riskScore: number;
  aiSummary?: string;
}

export interface Vitals {
  hr: number;
  hrTrend: number[];
  bp: { sys: number; dia: number };
  bpTrend: { sys: number[]; dia: number[] };
  spo2: number;
  spo2Trend: number[];
  temp: number;
  tempTrend: number[];
  rr: number;
  rrTrend: number[];
  lastUpdated: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  status: 'active' | 'discontinued' | 'prn';
  startDate: string;
  endDate?: string;
  prescriber: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  reference: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  date: string;
  trend?: number[];
}

export interface Note {
  id: string;
  type: 'progress' | 'nursing' | 'consult' | 'discharge';
  author: string;
  role: string;
  date: string;
  content: string;
}

export interface TimelineEvent {
  id: string;
  type: 'admission' | 'procedure' | 'medication' | 'lab' | 'note' | 'alert';
  title: string;
  description: string;
  date: string;
  icon?: string;
}

// Alert types
export interface Alert {
  id: string;
  patId: string;
  patName: string;
  type: 'lab' | 'vital' | 'medication' | 'summary' | 'general';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  body: string;
  time: string;
  read: boolean;
  panel: boolean;
}

// Navigation types
export type ViewType = 'dashboard' | 'patients' | 'patient' | 'alerts' | 'labs' | 'settings';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
  href: string;
}

// UI State types
export interface UIState {
  sidebarCollapsed: boolean;
  currentView: ViewType;
  notificationOpen: boolean;
}

// Filter types
export type AlertFilter = 'all' | 'critical' | 'warning' | 'unread';
export type AlertGroupBy = 'severity' | 'patient';

// Vital data types
export interface VitalData {
  val: string;
  unit?: string;
  trend: string;
  tc: "n" | "e" | "c"; // normal, elevated, critical
  bars: number[];
}

export interface VitalHistory {
  daily: number[];
  hourly: number[];
}

export interface Vital {
  key: string;
  label: string;
  unit: string;
  src: string;
}

// Lab report types
export interface LabRow {
  test: string;
  val: string;
  ref: string;
  flag: "NORMAL" | "HIGH" | "CRITICAL";
}

export interface LabReport {
  name: string;
  date: string;
  status: string;
  statusCls: "ok" | "f";
  rows: LabRow[];
}

// Finding type
export interface Finding {
  sev: "h" | "m" | "l"; // high, medium, low
  txt: string;
  src: string;
}

// History record types
export interface HistoryRecord {
  name: string;
  detail: string;
  tag: string;
  tc: string;
}

// Medication types
export interface ActiveMedication {
  name: string;
  class: string;
  frequency: string;
  prescribedBy: string;
  since: string;
  adherence: number;
  missedLast30: number;
  lastTaken: string;
  notes: string | null;
  dots: number[]; // 0 = missed, 1 = taken, 2 = not applicable
}

export interface PastMedication {
  name: string;
  class: string;
  from: string;
  to: string;
  reason: string;
}

export interface MedicationDetail {
  active: ActiveMedication[];
  past: PastMedication[];
}

// Patient data type
export interface Patient {
  id: string;
  init: string;
  name: string;
  meta: string;
  risk: "cr" | "hi" | "me" | "st" | "lo";
  rl: string;
  rc: string;
  bg: string;
  gender: "male" | "female";
  age: number;
  sex: string;
  blood: string;
  height: string;
  weight: string;
  healthScore: number;
  baselineScore: number;
  dataWindow: string;
  sleep: string;
  caffeine: string;
  alcohol: string;
  nicotine: string;
  doctorVisits: string;
  hospitalizations: string;
  vitals: Record<string, VitalData>;
  vitalHistory: Record<string, VitalHistory>;
  conditions: string[];
  medications: string[];
  allergies: string[];
  familyRisk: string[];
  summaryDoc: string;
  summaryPat: string;
  summaryConf: string;
  summaryBadge: "h" | "m";
  findings: Finding[];
  labs: LabReport[];
  medHistory: HistoryRecord[];
  famHistory: HistoryRecord[];
  lifestyle: HistoryRecord[];
  femaleSpecific: HistoryRecord[] | null;
  medicationDetail: MedicationDetail;
  prescriptions: Prescription[];
}

// Alert types
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertType = "vital" | "lab" | "summary";

export interface Alert {
  id: string;
  patId: string;
  type: AlertType;
  vital?: string;
  severity: AlertSeverity;
  title: string;
  body: string;
  time: number;
  read: boolean;
  panel: boolean;
}

// Prescription types
export interface PrescriptionItem {
  type: "medication" | "lab" | "referral";
  name: string;
  dosage?: string;
  duration?: string;
  instructions?: string;
  status: "pending" | "filled" | "ordered" | "completed" | "cancelled";
}

export interface Prescription {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  clinic: string;
  source: "upload" | "sync";
  status: "active" | "completed" | "expired";
  items: PrescriptionItem[];
  notes?: string;
}

// View types
export type ViewType = "dash" | "patients" | "summaries" | "labs" | "alerts";
export type PatientTab = "ov" | "twin" | "labs" | "hist" | "meds" | "rx";

// Filter types
export type RiskFilter = "all" | "critical" | "high" | "medium" | "low";
export type SortOption = "risk" | "name" | "age";
export type VitalFilter = "24h" | "7d" | "15d" | "30d";

// Risk order for sorting
export const RISK_ORDER: Record<string, number> = {
  cr: 0,
  hi: 1,
  me: 2,
  st: 3,
  lo: 3,
};

// Vital metadata
export const VITAL_META: Vital[] = [
  { key: "hr", label: "Heart Rate", unit: "bpm", src: "watch" },
  { key: "spo2", label: "SpO2", unit: "%", src: "watch" },
  { key: "bp", label: "Blood Pressure", unit: "mmHg", src: "manual" },
  { key: "sleep", label: "Sleep", unit: "/100", src: "watch" },
  { key: "glucose", label: "Glucose", unit: "mg/dL", src: "glucometer" },
  { key: "stress", label: "Stress", unit: "/100", src: "watch" },
  { key: "hrv", label: "HRV RMSSD", unit: "ms", src: "watch" },
  { key: "rem", label: "REM Sleep", unit: "min", src: "watch" },
  { key: "recovery", label: "Recovery", unit: "/100", src: "watch" },
  { key: "temp", label: "Temperature", unit: "°F", src: "thermometer" },
  { key: "steps", label: "Steps", unit: "steps", src: "watch" },
  { key: "calories", label: "Calories", unit: "kcal", src: "watch" },
];

// Overview vitals (shown in patient overview)
export const OV_VITALS = ["hr", "spo2", "bp", "glucose", "temp", "sleep", "steps", "calories"];

// AI Suggestions
export const AI_SUGGESTIONS = [
  "Consider adjusting Metformin dosage based on trending glucose levels",
  "Schedule follow-up cardiac evaluation within 2 weeks",
  "Recommend sleep study to investigate poor REM patterns",
  "Initiate smoking cessation counseling referral",
  "Review current medication interactions with pharmacist",
];

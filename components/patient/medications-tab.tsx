"use client";

import { Patient } from "@/lib/types";
import { Pill, Clock, AlertTriangle, CheckCircle, RefreshCw, Calendar } from "lucide-react";

interface MedicationsTabProps {
  patient: Patient;
}

export function MedicationsTab({ patient }: MedicationsTabProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case "discontinued":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            Discontinued
          </span>
        );
      case "prn":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            As Needed
          </span>
        );
      default:
        return null;
    }
  };

  // Separate active and discontinued medications
  const activeMedications = patient.medications.filter(
    (m) => m.status === "active" || m.status === "prn"
  );
  const discontinuedMedications = patient.medications.filter(
    (m) => m.status === "discontinued"
  );

  // Group active medications by category
  const medicationsByCategory = activeMedications.reduce((acc, med) => {
    if (!acc[med.category]) {
      acc[med.category] = [];
    }
    acc[med.category].push(med);
    return acc;
  }, {} as Record<string, typeof activeMedications>);

  const categoryColors: Record<string, string> = {
    "Cardiovascular": "bg-red-500/10 text-red-500",
    "Diabetes": "bg-blue-500/10 text-blue-500",
    "Pain Management": "bg-amber-500/10 text-amber-500",
    "Antibiotics": "bg-emerald-500/10 text-emerald-500",
    "Supplements": "bg-purple-500/10 text-purple-500",
    "Respiratory": "bg-cyan-500/10 text-cyan-500",
    "Gastrointestinal": "bg-pink-500/10 text-pink-500",
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Medications</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{patient.medications.length}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="text-2xl font-bold text-emerald-500">
            {patient.medications.filter((m) => m.status === "active").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">PRN</span>
          </div>
          <div className="text-2xl font-bold text-amber-500">
            {patient.medications.filter((m) => m.status === "prn").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-muted-foreground">Allergies</span>
          </div>
          <div className="text-2xl font-bold text-red-500">{patient.allergies.length}</div>
        </div>
      </div>

      {/* Allergies Alert */}
      {patient.allergies.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-500">Drug Allergies</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active Medications by Category */}
      {Object.entries(medicationsByCategory).map(([category, medications]) => (
        <div key={category} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryColors[category] || "bg-muted text-muted-foreground"}`}>
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
            <span className="text-sm text-muted-foreground ml-auto">
              {medications.length} medication{medications.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-border">
            {medications.map((med, index) => (
              <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{med.name}</h4>
                      {getStatusBadge(med.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {med.dosage} - {med.frequency}
                    </p>
                    <p className="text-sm text-muted-foreground">{med.indication}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {med.startDate}</span>
                    </div>
                    {med.refillsRemaining !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <RefreshCw className="w-4 h-4" />
                        <span>{med.refillsRemaining} refills remaining</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Discontinued Medications */}
      {discontinuedMedications.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden opacity-60">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Pill className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">Discontinued</h3>
            <span className="text-sm text-muted-foreground ml-auto">
              {discontinuedMedications.length} medication{discontinuedMedications.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-border">
            {discontinuedMedications.map((med, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-muted-foreground line-through">{med.name}</h4>
                  {getStatusBadge(med.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {med.dosage} - {med.indication}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

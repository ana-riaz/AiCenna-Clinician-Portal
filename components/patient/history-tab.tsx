"use client";

import { Patient } from "@/lib/types";
import {
  Clock,
  Hospital,
  Stethoscope,
  Syringe,
  AlertCircle,
  FileText,
  Calendar,
  User,
} from "lucide-react";

interface HistoryTabProps {
  patient: Patient;
}

export function HistoryTab({ patient }: HistoryTabProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "admission":
        return <Hospital className="w-4 h-4" />;
      case "discharge":
        return <Hospital className="w-4 h-4" />;
      case "procedure":
        return <Syringe className="w-4 h-4" />;
      case "diagnosis":
        return <Stethoscope className="w-4 h-4" />;
      case "consultation":
        return <User className="w-4 h-4" />;
      case "imaging":
        return <FileText className="w-4 h-4" />;
      case "emergency":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "admission":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "discharge":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "procedure":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      case "diagnosis":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "consultation":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/30";
      case "imaging":
        return "bg-pink-500/10 text-pink-500 border-pink-500/30";
      case "emergency":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  // Sort history by date (newest first)
  const sortedHistory = [...patient.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by year
  const historyByYear = sortedHistory.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<string, typeof sortedHistory>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Hospital className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Admissions</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {patient.history.filter((h) => h.type === "admission").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Syringe className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground">Procedures</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {patient.history.filter((h) => h.type === "procedure").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Stethoscope className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">Diagnoses</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {patient.history.filter((h) => h.type === "diagnosis").length}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-muted-foreground">Emergencies</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {patient.history.filter((h) => h.type === "emergency").length}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Medical Timeline</h3>

        {Object.entries(historyByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, events]) => (
            <div key={year} className="mb-8 last:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold text-foreground">{year}</h4>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="relative pl-8 border-l-2 border-border space-y-6">
                {events.map((event, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 ${getEventColor(
                        event.type
                      )}`}
                    />

                    {/* Event card */}
                    <div className="bg-muted/30 rounded-lg border border-border p-4 ml-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getEventColor(
                              event.type
                            )}`}
                          >
                            {getEventIcon(event.type)}
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <h5 className="font-medium text-foreground mb-1">{event.title}</h5>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      {event.provider && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Provider: {event.provider}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

"use client";

import { Clock, UserRound } from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { patientData } from "@/lib/data/patients";
import { cn } from "@/lib/utils";

const appointments = [
  { time: "09:00", patientId: "ahmed", reason: "Follow-up", status: "Checked in" },
  { time: "10:30", patientId: "fatima", reason: "Diabetes review", status: "Scheduled" },
  { time: "12:00", patientId: "sara", reason: "Post-op review", status: "Scheduled" },
  { time: "14:15", patientId: "omar", reason: "Lipid follow-up", status: "Scheduled" },
];

export function AppointmentsView() {
  const { openPatient } = useApp();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-5">
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-ink">Today</div>
              <div className="text-[10px] text-dim mt-0.5">{appointments.length} appointments</div>
            </div>
          </div>

          <div className="flex flex-col">
            {appointments.map((appointment) => {
              const patient = patientData[appointment.patientId];
              return (
                <button
                  key={`${appointment.time}-${appointment.patientId}`}
                  onClick={() => openPatient(appointment.patientId, "ov", "appointments")}
                  className="grid grid-cols-[80px_1fr_150px_110px] gap-3 items-center px-4 py-3 border-b border-white/[0.05] last:border-b-0 text-left hover:bg-white/[0.025] transition-colors"
                >
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold text-ink">
                    <Clock size={14} className="text-dim" />
                    {appointment.time}
                  </div>

                  <div className="min-w-0 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-cyan-300/12 text-cyan-100 flex items-center justify-center flex-shrink-0">
                      <UserRound size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-muted truncate">{patient?.name}</div>
                      <div className="text-[9px] text-dim truncate">{patient?.meta}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted truncate">{appointment.reason}</div>

                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                        appointment.status === "Checked in"
                          ? "bg-success/10 text-success border-success/25"
                          : "bg-white/[0.04] text-dim border-glass-border"
                      )}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

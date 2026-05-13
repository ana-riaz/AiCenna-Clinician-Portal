"use client";

interface PrescriptionsTabProps {
  patientId: string;
}

export function PrescriptionsTab({ patientId: _patientId }: PrescriptionsTabProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-[14px] font-bold text-dim tracking-wide">Coming Soon</div>
    </div>
  );
}

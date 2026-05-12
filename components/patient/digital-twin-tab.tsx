"use client";

import { patientData } from "@/lib/data/patients";
import { DigitalTwinSvg } from "@/components/patient/digital-twin-svg";

interface DigitalTwinTabProps {
  patientId: string;
}

export function DigitalTwinTab({ patientId }: DigitalTwinTabProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex items-center justify-center p-6 min-h-full">
        <DigitalTwinSvg patientId={patientId} className="max-h-[520px] w-auto" />
      </div>
    </div>
  );
}

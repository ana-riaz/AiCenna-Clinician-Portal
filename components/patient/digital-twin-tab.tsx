"use client";

import { patientData } from "@/lib/data/patients";
import { DigitalTwinHologram } from "@/components/patient/digital-twin-hologram";

interface DigitalTwinTabProps {
  patientId: string;
}

export function DigitalTwinTab({ patientId }: DigitalTwinTabProps) {
  const patient = patientData[patientId];
  if (!patient) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex items-center justify-center p-6 min-h-full">
        <DigitalTwinHologram patientId={patientId} className="h-[min(620px,calc(100vh-180px))] max-w-[760px]" />
      </div>
    </div>
  );
}

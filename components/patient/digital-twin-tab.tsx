"use client";

import { useState, useEffect, useRef } from "react";
import { Patient, Vitals } from "@/lib/types";
import { Activity, Heart, Wind, Thermometer, Droplets, Zap } from "lucide-react";

interface DigitalTwinTabProps {
  patient: Patient;
  vitals: Vitals;
}

export function DigitalTwinTab({ patient, vitals }: DigitalTwinTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Heart rate animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw ECG waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw ECG line
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const baseline = height / 2;
    const hr = vitals.heartRate;
    const cycleWidth = 300 - hr; // Faster HR = shorter cycles

    for (let x = 0; x < width; x++) {
      const offset = (x + animationFrame * 2) % cycleWidth;
      let y = baseline;

      // P wave
      if (offset > 10 && offset < 30) {
        y = baseline - Math.sin(((offset - 10) / 20) * Math.PI) * 10;
      }
      // QRS complex
      else if (offset > 40 && offset < 45) {
        y = baseline + (offset - 40) * 4;
      } else if (offset > 45 && offset < 55) {
        y = baseline - 40 + (offset - 45) * 8;
      } else if (offset > 55 && offset < 60) {
        y = baseline + 40 - (offset - 55) * 8;
      }
      // T wave
      else if (offset > 70 && offset < 100) {
        y = baseline - Math.sin(((offset - 70) / 30) * Math.PI) * 15;
      }

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }, [animationFrame, vitals.heartRate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      default:
        return "text-emerald-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500/10 border-red-500/30";
      case "warning":
        return "bg-amber-500/10 border-amber-500/30";
      default:
        return "bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const vitalCards = [
    {
      label: "Heart Rate",
      value: vitals.heartRate,
      unit: "bpm",
      icon: Heart,
      status: vitals.heartRate > 100 || vitals.heartRate < 60 ? "warning" : "normal",
    },
    {
      label: "Blood Pressure",
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: "mmHg",
      icon: Activity,
      status: vitals.bloodPressure.systolic > 140 ? "warning" : "normal",
    },
    {
      label: "SpO2",
      value: vitals.spO2,
      unit: "%",
      icon: Droplets,
      status: vitals.spO2 < 95 ? "critical" : vitals.spO2 < 98 ? "warning" : "normal",
    },
    {
      label: "Respiratory Rate",
      value: vitals.respiratoryRate,
      unit: "/min",
      icon: Wind,
      status: vitals.respiratoryRate > 20 ? "warning" : "normal",
    },
    {
      label: "Temperature",
      value: vitals.temperature.toFixed(1),
      unit: "°F",
      icon: Thermometer,
      status: vitals.temperature > 100.4 ? "critical" : vitals.temperature > 99.5 ? "warning" : "normal",
    },
    {
      label: "Glucose",
      value: vitals.glucose,
      unit: "mg/dL",
      icon: Zap,
      status: vitals.glucose > 180 || vitals.glucose < 70 ? "warning" : "normal",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Digital Twin Visualization */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Digital Twin Model</h3>
        <div className="relative aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Human body outline */}
          <svg viewBox="0 0 200 400" className="w-full h-full max-w-[200px]">
            {/* Body outline */}
            <ellipse cx="100" cy="40" rx="30" ry="35" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path
              d="M70 75 L60 180 L80 180 L85 140 L100 145 L115 140 L120 180 L140 180 L130 75"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <path d="M60 180 L55 300 L70 300 L85 200 L100 205 L115 200 L130 300 L145 300 L140 180" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d="M55 300 L50 390 L75 390 L70 300" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d="M130 300 L150 390 L125 390 L145 300" fill="none" stroke="#3b82f6" strokeWidth="2" />
            
            {/* Heart indicator */}
            <circle
              cx="100"
              cy="110"
              r="12"
              fill={vitals.heartRate > 100 ? "#ef4444" : "#22c55e"}
              opacity={0.3 + (Math.sin(animationFrame * 0.2) + 1) * 0.35}
            />
            <Heart
              className="absolute"
              style={{
                left: "calc(50% - 8px)",
                top: "25%",
              }}
            />
            
            {/* Lung indicators */}
            <ellipse
              cx="85"
              cy="120"
              rx="10"
              ry="20"
              fill={vitals.spO2 < 95 ? "#ef4444" : "#3b82f6"}
              opacity={0.2 + (Math.sin(animationFrame * 0.1) + 1) * 0.15}
            />
            <ellipse
              cx="115"
              cy="120"
              rx="10"
              ry="20"
              fill={vitals.spO2 < 95 ? "#ef4444" : "#3b82f6"}
              opacity={0.2 + (Math.sin(animationFrame * 0.1) + 1) * 0.15}
            />
          </svg>

          {/* Overlay indicators */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2">
            <Heart className={`w-4 h-4 ${vitals.heartRate > 100 ? "text-red-500" : "text-emerald-500"}`} />
            <span className="text-sm font-mono text-white">{vitals.heartRate} bpm</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2">
            <Droplets className={`w-4 h-4 ${vitals.spO2 < 95 ? "text-red-500" : "text-blue-500"}`} />
            <span className="text-sm font-mono text-white">{vitals.spO2}%</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2">
              <Thermometer className={`w-4 h-4 ${vitals.temperature > 100.4 ? "text-red-500" : "text-amber-500"}`} />
              <span className="text-sm font-mono text-white">{vitals.temperature.toFixed(1)}°F</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2">
              <Wind className={`w-4 h-4 ${vitals.respiratoryRate > 20 ? "text-amber-500" : "text-cyan-500"}`} />
              <span className="text-sm font-mono text-white">{vitals.respiratoryRate}/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* ECG Monitor */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">ECG Monitor</h3>
          <canvas ref={canvasRef} width={400} height={150} className="w-full rounded-lg" />
        </div>

        {/* Vital Signs Grid */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Real-Time Vitals</h3>
          <div className="grid grid-cols-2 gap-4">
            {vitalCards.map((vital) => (
              <div
                key={vital.label}
                className={`rounded-lg border p-4 ${getStatusBg(vital.status)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <vital.icon className={`w-4 h-4 ${getStatusColor(vital.status)}`} />
                  <span className="text-sm text-muted-foreground">{vital.label}</span>
                </div>
                <div className={`text-2xl font-bold ${getStatusColor(vital.status)}`}>
                  {vital.value}
                  <span className="text-sm font-normal ml-1">{vital.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

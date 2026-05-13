"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Users,
  Bell,
  CalendarDays,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeNav: string | null;
  onNavChange: (nav: string) => void;
  alertCount: number;
}

const navItems = [
  { key: "dash",     label: "Dashboard",   icon: LayoutGrid, section: "Overview" },
  { key: "patients", label: "My Patients", icon: Users },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "alerts",   label: "Active Alerts", icon: Bell, hasBadge: true },
  { key: "labs",     label: "Lab Reports", icon: FlaskConical, section: "Records" },
];

export function Sidebar({ activeNav, onNavChange, alertCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col flex-shrink-0 bg-[#F8FAFF] border-r border-[#dde3f0] z-10 transition-all duration-200",
        collapsed ? "w-14" : "w-[230px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-[58px] border-b border-[#dde3f0] flex-shrink-0 overflow-hidden",
          collapsed ? "justify-center px-0" : "px-5 gap-2.5"
        )}
      >
        {!collapsed && (
          <Image
            src="/aicenna-logo.png"
            alt="AiCenna"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "bg-transparent border-none cursor-pointer text-[#94a3b8] text-[11px] p-1.5 rounded-lg transition-all hover:bg-[rgba(56,189,248,0.12)] hover:text-[#1e3a5f]",
            !collapsed && "ml-auto"
          )}
          title="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 flex flex-col gap-0.5", collapsed ? "p-1.5" : "p-3")}>
        {navItems.map((item) => {
          const showSection = item.section && !collapsed;
          const Icon = item.icon;
          const isActive = activeNav === item.key;
          const badgeValue = item.hasBadge ? alertCount : 0;

          return (
            <div key={item.key}>
              {showSection && (
                <div className="text-[9px] font-bold tracking-wider text-[#94a3b8] uppercase py-2.5 px-2">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onNavChange(item.key)}
                className={cn(
                  "flex items-center w-full gap-2.5 py-2.5 px-2.5 rounded-xl cursor-pointer text-[#475569] transition-all text-xs font-medium whitespace-nowrap border border-transparent",
                  "hover:bg-[rgba(56,189,248,0.08)] hover:text-[#1e3a5f]",
                  isActive &&
                    "bg-gradient-to-br from-[rgba(56,189,248,0.14)] to-[rgba(139,92,246,0.10)] text-[#1a3a6f] border-[rgba(56,189,248,0.28)] font-semibold",
                  collapsed && "justify-center px-0 gap-0"
                )}
                title={item.label}
              >
                <span className="flex items-center justify-center w-4.5 flex-shrink-0">
                  <Icon size={16} />
                </span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && badgeValue > 0 && (
                  <span className="ml-auto text-[9px] font-bold py-0.5 px-1.5 rounded-full text-white bg-danger">
                    {badgeValue}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Doctor Card */}
      <div
        className={cn(
          "border-t border-[#dde3f0] overflow-hidden",
          collapsed ? "p-1.5 flex justify-center" : "p-3.5"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
            DI
          </div>
          {!collapsed && (
            <div>
              <div className="font-semibold text-xs text-[#1e3a5f]">Dr. Ibrahim</div>
              <div className="text-[10px] text-[#64748b]">Cardiologist</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

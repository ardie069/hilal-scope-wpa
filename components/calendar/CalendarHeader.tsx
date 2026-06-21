"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getHijriMonthName } from "@/lib/utils/hijri";
import type { HijriDate } from "@/types/hijri";

const METHODS = ["TABULAR", "KHGT", "UMM_AL_QURA", "MABIMS"];

interface Props {
  currentDate: Date;
  selectedMethod: string;
  mobileViewMode: "masehi" | "hijri";
  targetHijri: HijriDate | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMethodChange: (m: string) => void;
  onMobileViewChange: (v: "masehi" | "hijri") => void;
}

export default function CalendarHeader({
  currentDate, selectedMethod, mobileViewMode, targetHijri,
  onPrevMonth, onNextMonth, onMethodChange, onMobileViewChange,
}: Props) {
  return (
    <div className="relative z-10 p-4 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 border-b border-gray-100 dark:border-white/5">
      <div className="flex flex-col items-center md:items-start">
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white capitalize flex flex-col">
          <span className="sm:hidden">
            {mobileViewMode === "hijri" && targetHijri
              ? `${getHijriMonthName(targetHijri.month)} ${targetHijri.year} H`
              : format(currentDate, "MMMM yyyy")}
          </span>
          <span className="hidden sm:inline">{format(currentDate, "MMMM yyyy")}</span>
        </h2>
        <p className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1">
          {selectedMethod} GRID CORRECTED
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <div className={`flex-wrap justify-center gap-1 sm:gap-2 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-hide w-full ${mobileViewMode === "masehi" ? "hidden sm:flex" : "flex"}`}>
          {METHODS.map((m) => (
            <button
              key={m}
              onClick={() => onMethodChange(m)}
              className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all
                ${selectedMethod === m ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            >
              {m.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex sm:hidden w-full bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-white/10">
          {(["masehi", "hijri"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onMobileViewChange(v)}
              className={`flex-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                mobileViewMode === v ? "bg-primary text-white shadow-lg" : "text-gray-500"
              }`}
            >
              {v === "masehi" ? "Masehi" : "Hijriyah"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-white/10">
        <button onClick={onPrevMonth} className="btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-white dark:hover:bg-white/10">
          <ChevronLeft size={16} />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-white/10" />
        <button onClick={onNextMonth} className="btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-white dark:hover:bg-white/10">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

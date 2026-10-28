"use client";

import React from "react";
import { format } from "date-fns";
import { Info } from "lucide-react";
import CalendarHeader from "./CalendarHeader";
import CalendarDayCell from "./CalendarDayCell";

interface HijriCalendarViewProps {
  currentDate: Date | null;
  monthData: any[];
  loading: boolean;
  error: string | null;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  mobileViewMode: "masehi" | "hijri";
  setMobileViewMode: (mode: "masehi" | "hijri") => void;
  targetHijri: any;
  days: Date[];
  firstDayOfMonth: number;
  mobileDisplayDays: Date[];
  mobileGridFirstDay: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function CalendarGrid({
  renderDays,
  padDays,
  mode,
  isMobileSpecific,
  monthData,
  selectedMethod,
  loading,
}: {
  renderDays: Date[];
  padDays: number;
  mode: "masehi" | "hijri";
  isMobileSpecific: boolean;
  monthData: any[];
  selectedMethod: string;
  loading: boolean;
}) {
  return (
    <div className={`grid grid-cols-7 gap-1 sm:gap-4 ${isMobileSpecific ? "sm:hidden" : "hidden sm:grid"}`}>
      {Array.from({ length: padDays }).map((_, i) => (
        <div key={`pad-${i}`} className="min-h-12 sm:h-32 rounded-xl sm:rounded-3xl bg-gray-50/50 dark:bg-white/2 opacity-20" />
      ))}
      {renderDays.map((day) => (
        <CalendarDayCell
          key={format(day, "yyyy-MM-dd")}
          day={day}
          monthData={monthData}
          selectedMethod={selectedMethod}
          loading={loading}
          mode={mode}
          isMobileSpecific={isMobileSpecific}
        />
      ))}
    </div>
  );
}

export default function HijriCalendarView({
  currentDate,
  monthData,
  loading,
  error,
  selectedMethod,
  setSelectedMethod,
  mobileViewMode,
  setMobileViewMode,
  targetHijri,
  days,
  firstDayOfMonth,
  mobileDisplayDays,
  mobileGridFirstDay,
  onPrevMonth,
  onNextMonth,
}: HijriCalendarViewProps) {
  if (!currentDate) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in duration-700">
      <div className="bg-white/80 dark:bg-card-dark/40 backdrop-blur-3xl rounded-3xl sm:rounded-4xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <CalendarHeader
          currentDate={currentDate}
          selectedMethod={selectedMethod}
          mobileViewMode={mobileViewMode}
          targetHijri={targetHijri}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onMethodChange={setSelectedMethod}
          onMobileViewChange={setMobileViewMode}
        />

        <div className="p-2 sm:p-8 relative z-10">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-6">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center">
                {d}
              </div>
            ))}
          </div>
          <CalendarGrid
            renderDays={mobileDisplayDays}
            padDays={mobileGridFirstDay}
            mode={mobileViewMode}
            isMobileSpecific={true}
            monthData={monthData}
            selectedMethod={selectedMethod}
            loading={loading}
          />
          <CalendarGrid
            renderDays={days}
            padDays={firstDayOfMonth}
            mode={"masehi"}
            isMobileSpecific={false}
            monthData={monthData}
            selectedMethod={selectedMethod}
            loading={loading}
          />
        </div>

        <div className="p-3 sm:p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-4 sm:gap-6 justify-center">
          <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-primary bg-primary/20" />
            Hari Ini
          </div>
          <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/40" />
            Koreksi Metode Lain
          </div>
          <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
            <Info size={10} className="text-primary" />
            Aktif: {selectedMethod}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 sm:mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl text-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-loose">
          {error}
        </div>
      )}
    </div>
  );
}

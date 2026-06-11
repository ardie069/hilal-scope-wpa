"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { fetchHijriMonth } from "@/lib/api/calendar";
import { MonthDayInfo } from "@/types/calendar";
import { resolveLocation } from "@/lib/utils/geolocation";
import { getHijriMonthName } from "@/lib/utils/hijri";

const getDayColor = (day: Date, hijri?: { day: number, month: number }) => {
  if (hijri) {
    if (hijri.month === 10 && hijri.day === 1) return "text-red-500 dark:text-red-400";
    if (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) return "text-red-500 dark:text-red-400";
  }
  if (day.getDay() === 0) return "text-red-500 dark:text-red-400";
  
  if (hijri) {
    if (hijri.month === 1 && (hijri.day === 9 || hijri.day === 10)) return "text-primary";
    if (hijri.month === 9) return "text-primary";
    if (hijri.month === 12 && hijri.day === 9) return "text-primary";
    if (hijri.day >= 13 && hijri.day <= 15) return "text-primary";
  }
  if (day.getDay() === 5) return "text-primary";
  
  return "";
};

export default function HijriCalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthDayInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("KHGT");
  const [mobileViewMode, setMobileViewMode] = useState<"masehi" | "hijri">("hijri");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { lat, lon } = await resolveLocation();
        const prev = subMonths(currentDate, 1);
        const next = addMonths(currentDate, 1);

        const [resPrev, resCurr, resNext] = await Promise.all([
          fetchHijriMonth(prev.getFullYear(), prev.getMonth() + 1, lat, lon),
          fetchHijriMonth(currentDate.getFullYear(), currentDate.getMonth() + 1, lat, lon),
          fetchHijriMonth(next.getFullYear(), next.getMonth() + 1, lat, lon)
        ]);

        const allDays = [...resPrev.data.days, ...resCurr.data.days, ...resNext.data.days];
        const uniqueDays = Array.from(new Map(allDays.map(d => [d.gregorian_date, d])).values());

        setMonthData(uniqueDays);
      } catch (e) {
        console.error(e);
        setError("Gagal menyinkronkan data kalender.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const firstDayOfMonth = getDay(startOfMonth(currentDate));

  // Determine target Hijri month from the 15th of current Gregorian month
  const pivotDateKey = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), "yyyy-MM-dd");
  const pivotDayInfo = monthData.find(d => d.gregorian_date === pivotDateKey);
  const targetHijri = pivotDayInfo 
    ? (selectedMethod === "TABULAR" ? pivotDayInfo.tabular : pivotDayInfo.corrections[selectedMethod])
    : null;

  let mobileDisplayDays = days;
  let mobileGridFirstDay = firstDayOfMonth;

  if (mobileViewMode === "hijri" && targetHijri) {
    const hDays = monthData.filter(d => {
      const h = selectedMethod === "TABULAR" ? d.tabular : d.corrections[selectedMethod];
      return h.month === targetHijri.month && h.year === targetHijri.year;
    });
    if (hDays.length > 0) {
      mobileDisplayDays = hDays.map(d => new Date(d.gregorian_date));
      mobileGridFirstDay = getDay(mobileDisplayDays[0]);
    }
  }

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  const methods = ["TABULAR", "KHGT", "UMM_AL_QURA", "MABIMS"];

  const renderGrid = (renderDays: Date[], padDays: number, mode: "masehi" | "hijri", isMobileSpecific: boolean) => (
    <div className={`grid grid-cols-7 gap-1 sm:gap-4 ${isMobileSpecific ? 'sm:hidden' : 'hidden sm:grid'}`}>
      {Array.from({ length: padDays }).map((_, i) => (
        <div key={`pad-${i}`} className="aspect-square sm:h-32 rounded-xl sm:rounded-3xl bg-gray-50/50 dark:bg-white/2 opacity-20" />
      ))}
      {renderDays.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        const dayInfo = monthData.find((d) => d.gregorian_date === dateKey);
        const isToday = isSameDay(day, new Date());
        const displayHijri = dayInfo
          ? (selectedMethod === "TABULAR" ? dayInfo.tabular : dayInfo.corrections[selectedMethod])
          : null;
        const colorClass = getDayColor(day, displayHijri || undefined);

        return (
          <div
            key={dateKey}
            className={`aspect-square sm:h-32 p-1 sm:p-5 rounded-xl sm:rounded-3xl border transition-all duration-300 flex flex-col group relative overflow-hidden justify-center sm:justify-between
              ${isToday
                ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/2 hover:border-primary/30 hover:bg-white dark:hover:bg-white/5"
              }
            `}
          >
            <div className={`${mode === 'masehi' ? 'flex-1 flex items-center justify-center sm:block sm:flex-none' : 'hidden sm:block'}`}>
              <span className={`
                font-black transition-all
                ${mode === 'masehi' ? 'text-xl sm:text-xs sm:opacity-40' : 'text-[9px] sm:text-xs opacity-40'} 
                ${isToday && !colorClass ? "text-primary !opacity-100" : colorClass ? `${colorClass} !opacity-100` : "group-hover:opacity-100"}
              `}>
                {format(day, "d")}
              </span>
            </div>

            {dayInfo && displayHijri ? (
              <div className={`flex-col items-center gap-0.5 sm:gap-2 mb-0.5 sm:mb-1 mt-auto sm:mt-0 ${mode === 'masehi' ? 'hidden sm:flex' : 'flex'}`}>
                <span className={`text-base sm:text-3xl font-black tabular-nums group-hover:scale-110 transition-transform duration-500 ${colorClass || 'text-gray-900 dark:text-white'}`}>
                  {displayHijri.day}
                </span>
                {!(isMobileSpecific && mode === 'hijri') && (
                  <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity truncate w-full text-center px-0.5 ${colorClass || 'text-gray-600 dark:text-gray-400'}`}>
                    {getHijriMonthName(displayHijri.month, true)}
                  </span>
                )}

                <div className={`flex gap-0.5 sm:gap-1 ${mode === 'masehi' ? 'hidden sm:flex' : 'flex'}`}>
                  {methods.map(m => {
                    if (m === selectedMethod) return null;
                    const corr = m === "TABULAR" ? dayInfo.tabular : dayInfo.corrections[m];
                    const diff = corr && corr.day !== displayHijri.day;
                    if (!diff) return null;
                    return (
                      <div
                        key={m}
                        className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary/40 animate-pulse"
                        title={`${m}: ${corr.day} ${corr.month_name}`}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              loading && (
                <div className={`flex-col items-center gap-1 sm:gap-2 animate-pulse mt-auto sm:mt-0 ${mode === 'masehi' ? 'hidden sm:flex' : 'flex'}`}>
                  <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-white/10" />
                  <div className="w-6 h-1 sm:w-10 sm:h-2 rounded bg-gray-200 dark:bg-white/10" />
                </div>
              )
            )}

            {isToday && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in duration-700">
      <div className="bg-white/80 dark:bg-card-dark/40 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        {/* Header Control */}
        <div className="relative z-10 p-4 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 border-b border-gray-100 dark:border-white/5">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white capitalize flex flex-col">
              <span className="sm:hidden">
                {mobileViewMode === "hijri" && targetHijri
                  ? `${getHijriMonthName(targetHijri.month)} ${targetHijri.year} H`
                  : format(currentDate, "MMMM yyyy")}
              </span>
              <span className="hidden sm:inline">
                {format(currentDate, "MMMM yyyy")}
              </span>
            </h2>
            <p className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1">
              {selectedMethod} GRID CORRECTED
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className={`flex-wrap justify-center gap-1 sm:gap-2 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-hide w-full ${mobileViewMode === 'masehi' ? 'hidden sm:flex' : 'flex'}`}>
              {methods.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m)}
                  className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all
                    ${selectedMethod === m
                      ? "bg-primary text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {m.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="flex sm:hidden w-full bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setMobileViewMode("masehi")}
                className={`flex-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  mobileViewMode === "masehi" ? "bg-primary text-white shadow-lg" : "text-gray-500"
                }`}
              >
                Masehi
              </button>
              <button
                onClick={() => setMobileViewMode("hijri")}
                className={`flex-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  mobileViewMode === "hijri" ? "bg-primary text-white shadow-lg" : "text-gray-500"
                }`}
              >
                Hijriyah
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button onClick={handlePrevMonth} className="btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-white dark:hover:bg-white/10">
              <ChevronLeft size={16} />
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-white/10" />
            <button onClick={handleNextMonth} className="btn btn-ghost btn-circle btn-xs sm:btn-sm hover:bg-white dark:hover:bg-white/10">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="p-2 sm:p-8 relative z-10">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-6">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center">
                {d}
              </div>
            ))}
          </div>

          {/* Grid View mimicking Cally structure */}
          {renderGrid(mobileDisplayDays, mobileGridFirstDay, mobileViewMode, true)}
          {renderGrid(days, firstDayOfMonth, "masehi", false)}
        </div>

        {/* Legend */}
        <div className="p-3 sm:p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-4 sm:gap-6 justify-center">
          <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
            <div className="w-1.5 h-1.5 sm:w-2 h-2 rounded-full border border-primary bg-primary/20" />
            Hari Ini
          </div>
          <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
            <div className="w-1.5 h-1.5 sm:w-2 h-2 rounded-full bg-primary/40" />
            Koreksi Metode Lain
          </div>
          <div className="flex items-center gap-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
            <Info size={10} className="text-primary" />
            Aktif: {selectedMethod}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 sm:mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[1.5rem] text-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-loose">
          {error}
        </div>
      )}
    </div>
  );
}

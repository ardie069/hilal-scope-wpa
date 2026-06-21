"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { Info } from "lucide-react";
import { fetchHijriMonth } from "@/lib/api/calendar";
import type { MonthDayInfo } from "@/types/calendar";
import { resolveLocation } from "@/lib/utils/geolocation";
import CalendarHeader from "./CalendarHeader";
import CalendarDayCell from "./CalendarDayCell";

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
          fetchHijriMonth(next.getFullYear(), next.getMonth() + 1, lat, lon),
        ]);
        const allDays = [...resPrev.data.days, ...resCurr.data.days, ...resNext.data.days];
        const uniqueDays = Array.from(new Map(allDays.map((d) => [d.gregorian_date, d])).values());
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

  const days = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  const firstDayOfMonth = getDay(startOfMonth(currentDate));

  const pivotDateKey = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), "yyyy-MM-dd");
  const pivotDayInfo = monthData.find((d) => d.gregorian_date === pivotDateKey);
  const targetHijri = pivotDayInfo
    ? selectedMethod === "TABULAR" ? pivotDayInfo.tabular : pivotDayInfo.corrections[selectedMethod]
    : null;

  let mobileDisplayDays = days;
  let mobileGridFirstDay = firstDayOfMonth;
  if (mobileViewMode === "hijri" && targetHijri) {
    const hDays = monthData.filter((d) => {
      const h = selectedMethod === "TABULAR" ? d.tabular : d.corrections[selectedMethod];
      return h.month === targetHijri.month && h.year === targetHijri.year;
    });
    if (hDays.length > 0) {
      mobileDisplayDays = hDays.map((d) => new Date(d.gregorian_date));
      mobileGridFirstDay = getDay(mobileDisplayDays[0]);
    }
  }

  const renderGrid = (renderDays: Date[], padDays: number, mode: "masehi" | "hijri", isMobileSpecific: boolean) => (
    <div className={`grid grid-cols-7 gap-1 sm:gap-4 ${isMobileSpecific ? "sm:hidden" : "hidden sm:grid"}`}>
      {Array.from({ length: padDays }).map((_, i) => (
        <div key={`pad-${i}`} className="aspect-square sm:h-32 rounded-xl sm:rounded-3xl bg-gray-50/50 dark:bg-white/2 opacity-20" />
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

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in duration-700">
      <div className="bg-white/80 dark:bg-card-dark/40 backdrop-blur-3xl rounded-3xl sm:rounded-4xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <CalendarHeader
          currentDate={currentDate}
          selectedMethod={selectedMethod}
          mobileViewMode={mobileViewMode}
          targetHijri={targetHijri}
          onPrevMonth={() => setCurrentDate((prev) => subMonths(prev, 1))}
          onNextMonth={() => setCurrentDate((prev) => addMonths(prev, 1))}
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
          {renderGrid(mobileDisplayDays, mobileGridFirstDay, mobileViewMode, true)}
          {renderGrid(days, firstDayOfMonth, "masehi", false)}
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

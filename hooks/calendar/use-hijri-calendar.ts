"use client";

import { useState, useEffect, useRef } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, format } from "date-fns";
import { fetchHijriMonth } from "@/lib/api/calendar";
import type { MonthDayInfo } from "@/types/calendar";
import { resolveLocationWithFallback } from "@/lib/utils/geolocation";

export function useHijriCalendar() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [monthData, setMonthData] = useState<MonthDayInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("KHGT");
  const [mobileViewMode, setMobileViewMode] = useState<"masehi" | "hijri">("hijri");
  const locRef = useRef<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!currentDate) {
      setCurrentDate(new Date());
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const loc = locRef.current ?? (locRef.current = await resolveLocationWithFallback());
        const prev = subMonths(currentDate, 1);
        const next = addMonths(currentDate, 1);
        const [resPrev, resCurr, resNext] = await Promise.all([
          fetchHijriMonth(prev.getFullYear(), prev.getMonth() + 1, loc.lat, loc.lon),
          fetchHijriMonth(currentDate.getFullYear(), currentDate.getMonth() + 1, loc.lat, loc.lon),
          fetchHijriMonth(next.getFullYear(), next.getMonth() + 1, loc.lat, loc.lon),
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

  const days = currentDate ? eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) }) : [];
  const firstDayOfMonth = currentDate ? getDay(startOfMonth(currentDate)) : 0;

  const pivotDateKey = currentDate ? format(currentDate, "yyyy-MM-dd") : "";
  const pivotDayInfo = monthData.find((d) => d.gregorian_date === pivotDateKey);
  const targetHijri = pivotDayInfo
    ? selectedMethod === "TABULAR" ? pivotDayInfo.tabular : pivotDayInfo.corrections[selectedMethod]
    : null;

  let mobileDisplayDays = days;
  let mobileGridFirstDay = firstDayOfMonth;
  if (currentDate && mobileViewMode === "hijri" && targetHijri) {
    const hDays = monthData.filter((d) => {
      const h = selectedMethod === "TABULAR" ? d.tabular : d.corrections[selectedMethod];
      return h && h.month === targetHijri.month && h.year === targetHijri.year;
    });
    if (hDays.length > 0) {
      mobileDisplayDays = hDays.map((d) => new Date(d.gregorian_date + "T00:00:00"));
      mobileGridFirstDay = getDay(mobileDisplayDays[0]);
    }
  }

  const onPrevMonth = () => setCurrentDate((prev) => (prev ? subMonths(prev, 1) : prev));
  const onNextMonth = () => setCurrentDate((prev) => (prev ? addMonths(prev, 1) : prev));

  return {
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
  };
}

import { useState, useCallback, useEffect } from "react";
import type { DateSystem, UnifiedMonthData } from "@/types/calendar";
import type { MethodKey } from "@/types/hijri";
import { fetchHijriDate, fetchHijriCalendar } from "@/lib/api/hijri";
import {
  HIJRI_MONTHS_INDONESIA_GRAMMAR,
  GREGORIAN_MONTHS,
} from "@/lib/constants";

export interface TodayInfo {
  month: number;
  day: number;
  year: number;
  system: DateSystem;
}

/**
 * Tabular Hijri calendar — client-side approximation.
 * Used to build monthly grids without a backend calendar endpoint.
 */
function getTabularHijriMonths(year: number): UnifiedMonthData[] {
  return HIJRI_MONTHS_INDONESIA_GRAMMAR.map((m) => {
    // Tabular Hijri: odd months = 30 days, even months = 29 days
    // Last month (12) = 30 days in leap years
    const isLeap = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(
      ((year - 1) % 30) + 1,
    );
    const totalDays =
      m.id % 2 === 1 ? 30 : m.id === 12 && isLeap ? 30 : 29;

    // Approximate start_gregorian using epoch
    const epochJD = 1948439.5; // 16 Jul 622 CE
    const hijriDays =
      (year - 1) * 354 +
      Math.floor((3 + 11 * year) / 30) +
      Array.from({ length: m.id - 1 }, (_, i) =>
        (i + 1) % 2 === 1 ? 30 : 29,
      ).reduce((a, b) => a + b, 0);
    const jd = epochJD + hijriDays;
    const gregDate = jdToGregorian(jd);

    // Calculate day of week for day 1 (0=Sun, 1=Mon, ..., 6=Sat)
    const dow = Math.floor(jd + 1.5) % 7;

    return {
      month_id: m.id,
      month_name: m.name,
      total_days: totalDays,
      day_1_weekday: dow,
      start_gregorian: gregDate,
    };
  });
}

function getGregorianMonths(year: number): UnifiedMonthData[] {
  return GREGORIAN_MONTHS.map((m) => {
    const firstDay = new Date(year, m.id - 1, 1);
    const totalDays = new Date(year, m.id, 0).getDate();
    return {
      month_id: m.id,
      month_name: m.name,
      total_days: totalDays,
      day_1_weekday: firstDay.getDay(),
    };
  });
}

/** Convert Julian Day Number to Gregorian date string (YYYY-MM-DD) */
function jdToGregorian(jd: number): string {
  const z = Math.floor(jd + 0.5);
  const a =
    z < 2299161
      ? z
      : z +
        1 +
        Math.floor((Math.floor((z - 1867216.25) / 36524.25) * 3) / 4) * -1 +
        Math.floor((z - 1867216.25) / 36524.25);
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function useCalendar(
  year: number | null,
  dateSystem: DateSystem,
  method: MethodKey,
  lat: number | null,
  lon: number | null,
) {
  const [months, setMonths] = useState<UnifiedMonthData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<TodayInfo | null>(null);

  const loadCalendar = useCallback(async () => {
    if (year === null) return;
    setLoading(true);
    setError(null);

    try {
      if (dateSystem === "hijri") {
        if (lat === null || lon === null) {
          setLoading(false);
          return;
        }

        // 1. Sync "today" with current hijri date from API
        const apiRes = await fetchHijriDate(lat, lon);
        const hd = apiRes.data.methods[method]?.hijri_date;
        if (hd) {
          setToday({
            year: hd.year,
            month: hd.month,
            day: hd.day,
            system: "hijri",
          });
        }

        // 2. Fetch the entire 12-month calendar for this year & method
        const calRes = await fetchHijriCalendar(year, lat, lon, method);
        if (calRes.status === "success") {
          setMonths(calRes.data.months);
        }
      } else {
        const now = new Date();
        setToday({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
          system: "gregorian",
        });

        setMonths(getGregorianMonths(year));
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data kalender.");
    } finally {
      setLoading(false);
    }
  }, [year, dateSystem, method, lat, lon]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  return { months, loading, error, today, refresh: loadCalendar };
}

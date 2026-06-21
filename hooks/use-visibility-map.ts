"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchVisibilityMap, fetchHijriCalendar, fetchHijriDate } from "@/lib/api/hijri";
import type { VisibilityMapData } from "@/types/hijri";

export interface HijriMonth {
  name: string;
  date: string;
}

export function useVisibilityMap() {
  const [hijriMonths, setHijriMonths] = useState<HijriMonth[]>([]);
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("KHGT");
  const [data, setData] = useState<VisibilityMapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initNextMonth = async () => {
      setLoadingMonths(true);
      try {
        const nowResp = await fetchHijriDate(-6.2, 106.8);
        const { year } = nowResp.data.methods.KHGT.hijri_date;

        const calResp = await fetchHijriCalendar(year, -6.2, 106.8, "KHGT");
        if (calResp.status === "success" && calResp.data?.months) {
          const allMonths = calResp.data.months;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let targetMonth = null;
          for (const m of allMonths) {
            const startDate = new Date(m.start_gregorian);
            startDate.setDate(startDate.getDate() - 1);
            if (startDate >= today) { targetMonth = m; break; }
          }

          if (!targetMonth) {
            const nextYearResp = await fetchHijriCalendar(year + 1, -6.2, 106.8, "KHGT");
            if (nextYearResp.status === "success") targetMonth = nextYearResp.data.months[0];
          }

          if (targetMonth) {
            const [y, m, d] = targetMonth.start_gregorian.split("-").map(Number);
            const dateObj = new Date(Date.UTC(y, m - 1, d));
            dateObj.setUTCDate(dateObj.getUTCDate() - 1);
            const obsDate = dateObj.toISOString().split("T")[0];
            setHijriMonths([{ name: targetMonth.month_name, date: obsDate }]);
            setDate(obsDate);
          }
        }
      } catch {
        setError("Gagal mengambil data kalender Hijriyah.");
      } finally {
        setLoadingMonths(false);
      }
    };
    initNextMonth();
  }, []);

  const loadData = useCallback(async (targetDate: string, targetMethod: string) => {
    if (!targetDate) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchVisibilityMap(targetDate, targetMethod);
      if (resp.status === "success") {
        setData(resp.data);
      } else {
        setError("Gagal memuat data visibilitas.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message || "Kesalahan koneksi ke server astronomi." : "Kesalahan koneksi ke server astronomi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) loadData(date, method);
  }, [date, method, loadData]);

  return { hijriMonths, date, method, setMethod, data, loading, loadingMonths, error };
}

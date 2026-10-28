"use client";

import { useState, useCallback } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { usePrayer } from "@/hooks/use-prayer";

export function usePrayerTimes() {
  const mounted = useMounted();
  const [method, setMethod] = useState("KEMENAG");
  const { data, loading, error } = usePrayer(undefined, method);

  const methods = [
    { id: "KEMENAG", name: "Kemenag RI" },
    { id: "UMM_AL_QURA", name: "Umm al-Qura (Makkah)" },
    { id: "MWL", name: "Muslim World League" },
    { id: "ISNA", name: "ISNA (Amerika Utara)" },
    { id: "EGYPTIAN", name: "Egyptian General Authority" },
    { id: "KARACHI", name: "University of Islamic Sciences, Karachi" },
  ];

  const prayerNames: Record<string, string> = {
    fajr: "Subuh",
    sunrise: "Terbit",
    dhuhr: "Dzuhur",
    asr: "Ashar",
    maghrib: "Maghrib",
    isha: "Isya",
    midnight: "Tengah Malam",
    third_night: "Sepertiga Malam",
  };

  return {
    mounted,
    method,
    setMethod,
    data,
    loading,
    error,
    methods,
    prayerNames,
  };
}

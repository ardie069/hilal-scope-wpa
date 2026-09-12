import { useEffect, useState, useCallback, useRef } from "react";
import type {
  MethodKey,
  HijriResponse,
  MethodResult,
} from "@/types/hijri";
import { fetchHijriDate } from "@/lib/api/hijri";
import {
  resolveLocationWithFallback,
  type ResolvedLocation,
} from "@/lib/utils/geolocation";
import { getWeton } from "@/lib/utils/weton";

interface UseHijriResult {
  /** Full multi-method response from API */
  response: HijriResponse | null;
  /** Convenience: selected method result */
  methodResult: MethodResult | null;
  weton: string | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useHijri(selectedMethod: MethodKey): UseHijriResult {
  const [response, setResponse] = useState<HijriResponse | null>(null);
  const [weton, setWeton] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locRef = useRef<ResolvedLocation | null>(null);

  const loadHijri = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loc =
        locRef.current ?? (locRef.current = await resolveLocationWithFallback());

      const apiRes = await fetchHijriDate(loc.lat, loc.lon);
      setResponse(apiRes.data);

      const now = new Date();
      const timeZone = loc.timezone ?? "Asia/Jakarta";
      const dayName = now.toLocaleDateString("id-ID", {
        weekday: "long",
        timeZone,
      });
      const fixDay = dayName === "Minggu" ? "Ahad" : dayName;
      setWeton(`${fixDay} ${getWeton(now, timeZone)}`);
    } catch (err) {
      setError("Gagal mensinkronkan data dengan posisi benda langit.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHijri();
  }, [loadHijri]);

  const methodResult = response?.methods[selectedMethod] ?? null;

  return {
    response,
    methodResult,
    weton,
    loading,
    error,
    reload: loadHijri,
  };
}

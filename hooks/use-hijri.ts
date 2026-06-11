import { useEffect, useState, useCallback } from "react";
import type {
  MethodKey,
  HijriResponse,
  MethodResult,
} from "@/types/hijri";
import { fetchHijriDate } from "@/lib/api/hijri";
import { resolveLocation } from "@/lib/utils/geolocation";
import { isLocationInJava, getWeton } from "@/lib/utils/weton";

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
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const [response, setResponse] = useState<HijriResponse | null>(null);
  const [weton, setWeton] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHijri = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let currentLat = lat;
      let currentLon = lon;

      if (currentLat === null || currentLon === null) {
        const loc = await resolveLocation();
        currentLat = loc.lat;
        currentLon = loc.lon;
        setLat(loc.lat);
        setLon(loc.lon);
      }

      const apiRes = await fetchHijriDate(currentLat, currentLon);
      setResponse(apiRes.data);

      if (isLocationInJava(currentLat, currentLon)) {
        const now = new Date();
        const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
        const fixDay = dayName === "Minggu" ? "Ahad" : dayName;
        setWeton(`${fixDay} ${getWeton(now)}`);
      } else {
        setWeton(null);
      }
    } catch (err) {
      setError("Gagal mensinkronkan data dengan posisi benda langit.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

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

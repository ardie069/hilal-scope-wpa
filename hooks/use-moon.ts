import { useEffect, useState, useCallback } from "react";
import type { MoonTelemetry } from "@/types/moon";
import { fetchMoonTelemetry } from "@/lib/api/moon";
import { resolveLocation } from "@/lib/utils/geolocation";

interface UseMoonResult {
  data: MoonTelemetry | null;
  loading: boolean;
  error: string | null;
  lat: number | null;
  lon: number | null;
  reload: () => void;
}

export function useMoon(): UseMoonResult {
  const [data, setData] = useState<MoonTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const loadMoon = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loc = await resolveLocation();
      setLat(loc.lat);
      setLon(loc.lon);
      const res = await fetchMoonTelemetry(loc.lat, loc.lon);
      setData(res);
    } catch (err) {
      setError("Gagal mensinkronkan data visualisasi bulan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMoon();
  }, [loadMoon]);

  return { data, loading, error, lat, lon, reload: loadMoon };
}

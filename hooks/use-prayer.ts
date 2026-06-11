import { useEffect, useState, useCallback } from "react";
import type { PrayerResponse } from "@/types/prayer";
import { fetchPrayerTimes } from "@/lib/api/prayer";
import { resolveLocation } from "@/lib/utils/geolocation";

interface UsePrayerResult {
  data: PrayerResponse | null;
  loading: boolean;
  error: string | null;
  lat: number | null;
  lon: number | null;
  reload: () => void;
}

export function usePrayer(
  date?: string,
  method: string = "KEMENAG",
  madhab: string = "shafii",
  highLat: string = "ANGLE_BASED"
): UsePrayerResult {
  const [data, setData] = useState<PrayerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const loadPrayer = useCallback(async () => {
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

      const res = await fetchPrayerTimes(currentLat, currentLon, date, method, madhab, highLat);
      setData(res.data);
    } catch (err) {
      setError("Gagal mengambil data jadwal sholat.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, date, method, madhab, highLat]);

  useEffect(() => {
    loadPrayer();
  }, [loadPrayer]);

  return { data, loading, error, lat, lon, reload: loadPrayer };
}

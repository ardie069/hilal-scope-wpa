import type { PrayerAPIResponse } from "@/types/prayer";
import { request } from "./client";

export function fetchPrayerTimes(
  lat: number,
  lon: number,
  date?: string,
  method: string = "KEMENAG",
  madhab: string = "shafii",
  highLat: string = "ANGLE_BASED"
) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    method,
    madhab,
    high_lat: highLat,
  });
  if (date) params.set("date", date);

  return request<PrayerAPIResponse>(`/api/v4/prayer/times?${params}`);
}

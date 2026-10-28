"use server";

import { fetchPrayerTimes } from "@/lib/api/prayer";
import type { PrayerResponse } from "@/types/prayer";

export async function getPrayerTimes(
  lat: number,
  lon: number,
  date?: string,
  method: string = "KEMENAG",
  madhab: string = "shafii",
  highLat: string = "ANGLE_BASED"
): Promise<PrayerResponse> {
  const res = await fetchPrayerTimes(lat, lon, date, method, madhab, highLat);
  return res.data;
}

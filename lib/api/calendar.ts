import type { MonthAPIResponse } from "@/types/calendar";
import { request } from "./client";

/**
 * GET /api/v4/hijri/month
 * Fetches Hijri calendar data for a specific Gregorian month.
 */
export function fetchHijriMonth(
  year: number,
  month: number,
  lat: number,
  lon: number
) {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    lat: String(lat),
    lon: String(lon),
  });

  return request<MonthAPIResponse>(`/api/v4/hijri/month?${params}`);
}

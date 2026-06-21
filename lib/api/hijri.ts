import type { HijriAPIResponse } from "@/types/hijri";
import { request } from "./client";

/**
 * GET /api/v4/hijri/date
 * Returns ALL method results in a single response.
 */
export function fetchHijriDate(lat: number, lon: number, date?: string) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  if (date) params.set("date", date);

  return request<HijriAPIResponse>(`/api/v4/hijri/date?${params}`);
}

export function fetchHijriCalendar(
  year: number,
  lat: number,
  lon: number,
  method: string,
) {
  const params = new URLSearchParams({
    year: String(year),
    lat: String(lat),
    lon: String(lon),
    method,
  });

  return request<{ status: string; data: { months: unknown[] } }>(
    `/api/v4/hijri/calendar?${params}`,
  );
}

export function fetchVisibilityMap(date: string, method: string) {
  const params = new URLSearchParams({
    date,
    method,
  });

  return request<{ status: string; data: unknown }>(
    `/api/v4/hijri/visibility-map?${params}`,
  );
}

export function fetchHijriSearch(date: string) {
  const params = new URLSearchParams({ date });
  return request<{ status: string; data: unknown }>(
    `/api/v4/hijri/search?${params}`,
  );
}

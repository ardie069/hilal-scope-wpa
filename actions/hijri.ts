"use server";

import { fetchHijriDate } from "@/lib/api/hijri";
import { fetchHijriMonth } from "@/lib/api/calendar";
import type { HijriResponse } from "@/types/hijri";
import type { MonthDayInfo } from "@/types/calendar";

export async function getHijriDate(lat: number, lon: number, date?: string): Promise<HijriResponse> {
  const res = await fetchHijriDate(lat, lon, date);
  return res.data;
}

export async function getHijriMonth(
  year: number,
  month: number,
  lat: number,
  lon: number
): Promise<{ days: MonthDayInfo[] }> {
  const res = await fetchHijriMonth(year, month, lat, lon);
  return res.data;
}

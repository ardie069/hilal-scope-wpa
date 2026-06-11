import type { MoonTelemetry } from "@/types/moon";
import { request } from "./client";

/**
 * GET /api/v4/moon/telemetry
 */
export function fetchMoonTelemetry(lat: number, lon: number) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });

  return request<MoonTelemetry>(`/api/v4/moon/telemetry?${params}`);
}

const DEFAULT_TIMEZONE = "Asia/Jakarta";

export interface ResolvedLocation {
  lat: number;
  lon: number;
  timezone: string | null;
}

/**
 * Shared geolocation resolution — extracted from duplicate implementations
 * across use-hijri, use-moon, and use-rukyat hooks.
 */
export function resolveLocation(): Promise<ResolvedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timezone: null,
        }),
      reject,
    );
  });
}

/**
 * Resolve the IANA timezone for a coordinate pair via timeapi.io.
 */
export async function getTimeZone(
  lat: number,
  lon: number,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`,
    );
    if (res.ok) {
      const data = await res.json();
      if (typeof data.timeZone === "string") return data.timeZone;
    }
  } catch {
    // Ignored — caller falls back to default timezone.
  }
  return null;
}

/**
 * Resolve location with IP-based fallback.
 * Used by calendar page and other places that need silent location detection.
 */
export async function resolveLocationWithFallback(): Promise<ResolvedLocation> {
  try {
    const loc = await resolveLocation();
    const timezone = loc.timezone ?? (await getTimeZone(loc.lat, loc.lon));
    return { lat: loc.lat, lon: loc.lon, timezone: timezone ?? DEFAULT_TIMEZONE };
  } catch {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      if (data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timezone ?? DEFAULT_TIMEZONE,
        };
      }
    } catch {
      // Silent fallback to Jakarta
    }
    return { lat: -6.2, lon: 106.845, timezone: DEFAULT_TIMEZONE };
  }
}

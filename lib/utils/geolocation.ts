/**
 * Shared geolocation resolution — extracted from duplicate implementations
 * across use-hijri, use-moon, and use-rukyat hooks.
 */
export function resolveLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject,
    );
  });
}

/**
 * Resolve location with IP-based fallback.
 * Used by calendar page and other places that need silent location detection.
 */
export async function resolveLocationWithFallback(): Promise<{
  lat: number;
  lon: number;
}> {
  try {
    return await resolveLocation();
  } catch {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      if (data.latitude && data.longitude) {
        return { lat: data.latitude, lon: data.longitude };
      }
    } catch {
      // Silent fallback to Jakarta
    }
    return { lat: -6.2, lon: 106.845 };
  }
}

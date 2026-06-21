export function toDMS(degrees: number): string {
  const absolute = Math.abs(degrees);
  const d = Math.floor(absolute);
  const m = Math.floor((absolute - d) * 60);
  const s = Math.round(((absolute - d) * 60 - m) * 60);
  const sign = degrees < 0 ? "-" : "";
  return `${sign}${d}° ${m}' ${s.toString().padStart(2, "0")}"`;
}

export function formatDegreeDMS(degrees: number | undefined, precision = 1): string {
  if (degrees === undefined) return "-";
  return `${degrees.toFixed(precision)}° (${toDMS(degrees)})`;
}

export function formatMoonAgeHM(hours: number | undefined): string {
  if (hours === undefined) return "-";
  const absolute = Math.abs(hours);
  const h = Math.floor(absolute);
  const m = Math.round((absolute - h) * 60);
  const sign = hours < 0 ? "-" : "";
  return `${hours.toFixed(1)}j (${sign}${h}j ${m}m)`;
}

export function formatSunsetCheck(dateStr: string, tzStr: string): string {
  // Input: "2026-04-17 18:58:00", "-11 (UTC -11)"
  try {
    const cleanDateStr = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
    const date = new Date(cleanDateStr);
    
    const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    // Extract UTC part: "-11 (UTC -11)" -> "UTC -11"
    const utcMatch = tzStr.match(/\((UTC [^)]+)\)/);
    const utcLabel = utcMatch ? utcMatch[1] : tzStr;

    return `${dayName}, ${day} ${month} ${year} - ${time} (${utcLabel})`;
  } catch {
    return `${dateStr} (${tzStr})`;
  }
}

export function findLowerIndex(arr: number[], val: number, descending: boolean): number {
  let lo = 0, hi = arr.length - 1;
  if (descending) {
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] > val) lo = mid + 1;
      else hi = mid - 1;
    }
    return lo;
  } else {
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < val) lo = mid + 1;
      else hi = mid - 1;
    }
    return hi;
  }
}

type RGBA = { r: number; g: number; b: number; a: number };
type ColorMap = Record<string, [number, number, number]>;

export function computeKHGTPixel(
  alt: number,
  elong: number,
  sunsetUtc: number,
  colors: ColorMap,
): RGBA & { isAltBoundary: boolean; isElongBoundary: boolean; isSunsetBoundary: boolean } {
  let r = 0, g = 0, b = 0, a = 0;
  let isAltBoundary = false, isElongBoundary = false, isSunsetBoundary = false;

  const altDist = Math.abs(alt - 5.0);
  const elongDist = Math.abs(elong - 8.0);
  const sunsetDist = Math.abs(sunsetUtc);

  if (altDist < 0.12) {
    r = 239; g = 68; b = 68; a = 255; isAltBoundary = true;
  } else if (elongDist < 0.12) {
    r = 0; g = 0; b = 0; a = 255; isElongBoundary = true;
  } else if (sunsetDist < 0.08 || Math.abs(sunsetDist - 24) < 0.08) {
    r = 249; g = 115; b = 22; a = 255; isSunsetBoundary = true;
  } else if (alt >= 5.0 && elong >= 8.0) {
    [r, g, b] = colors["KHGT_YES"]; a = 120;
  } else if (alt <= 0) {
    [r, g, b] = colors["F"]; a = 160;
  }

  return { r, g, b, a, isAltBoundary, isElongBoundary, isSunsetBoundary };
}

export function computeODEHPixel(
  alt: number,
  arcv: number,
  width: number,
  colors: ColorMap,
): RGBA {
  if (alt <= 0) {
    const [r, g, b] = colors["F"];
    return { r, g, b, a: 160 };
  }

  const wArcmin = width * 60.0;
  const v = arcv - (7.1651 - 6.3226 * wArcmin + 0.7319 * wArcmin ** 2 - 0.1018 * wArcmin ** 3);

  let r = 0, g = 0, b = 0, a = 0;
  if (v >= 5.65) {
    [r, g, b] = colors["ODEH_A"]; a = 160;
    g = Math.min(255, g + Math.min(20, (v - 5.65) * 5));
  } else if (v >= 2.0) {
    [r, g, b] = colors["ODEH_B"]; a = 150;
  } else if (v >= -0.96) {
    [r, g, b] = colors["ODEH_C"]; a = 130;
  } else if (v >= -2.0) {
    [r, g, b] = colors["ODEH_D"]; a = 110;
  }

  const distToThreshold = Math.min(Math.abs(v - 5.65), Math.abs(v - 2.0), Math.abs(v + 0.96));
  if (distToThreshold < 0.3 && a > 0) a = a * 0.75;

  return { r, g, b, a };
}

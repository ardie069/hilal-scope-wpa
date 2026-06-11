/** Match Go: models.MoonTelemetry */
export interface MoonTelemetry {
  altitude: number;
  altitude_apparent?: number;
  azimuth: number;
  elongation: number;
  elongation_geo?: number;
  illumination: number;
  distance_km: number;
  age_hours: number;
  phase_name: string;
  moonrise?: string;
  moonset?: string;
  timestamp: string;
}

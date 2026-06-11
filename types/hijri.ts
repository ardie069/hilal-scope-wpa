/** Match Go: models.HijriDate */
export interface HijriDate {
  day: number;
  month: number;
  month_name: string;
  year: number;
  is_tabular: boolean;
}

/** Match Go: models.LocationInfo */
export interface LocationInfo {
  latitude: number;
  longitude: number;
}

/** Match Go: models.HilalPrediction */
export interface HilalPrediction {
  check_date_utc: string;
  check_date_local: string;
  timezone_name: string;
  is_new_month: boolean;
  ijtima_time: string;
  altitude: number;
  altitude_apparent?: number;
  elongation: number;
  elongation_geo?: number;
  age_hours: number;
  location?: LocationInfo;
  khgt_global_valid?: boolean;
  khgt_america_exception?: boolean;
  moonset_time_local?: string;
  moonset_diff_minutes?: number;
}

/** Match Go: models.MethodResult */
export interface MethodResult {
  hijri_date: HijriDate;
  current_altitude?: number;
  current_elongation?: number;
  current_elongation_geo?: number;
  reference_altitude?: number;
  reference_elongation?: number;
  reference_elongation_geo?: number;
  prediction?: HilalPrediction;
  local_prediction?: HilalPrediction;
}

/** Match Go: models.HijriResponse */
export interface HijriResponse {
  gregorian_date: string;
  location: LocationInfo;
  methods: Record<string, MethodResult>;
}

/** Go API wraps response in { status, data } */
export interface HijriAPIResponse {
  status: string;
  data: HijriResponse;
}

/** Backend method keys */
export type MethodKey =
  | "TABULAR"
  | "MABIMS"
  | "KHGT"
  | "UMM_AL_QURA";

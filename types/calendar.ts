import { HijriDate } from "./hijri";

export interface MonthDayInfo {
  gregorian_date: string;
  tabular: HijriDate;
  corrections: Record<string, HijriDate>;
}

export interface GregorianMonthResponse {
  year: number;
  month: number;
  lat: number;
  lon: number;
  days: MonthDayInfo[];
}

export interface MonthAPIResponse {
  status: string;
  data: GregorianMonthResponse;
}

export type DateSystem = "hijri" | "gregorian";

export interface UnifiedMonthData {
  month_id: number;
  month_name: string;
  total_days: number;
  day_1_weekday: number;
  start_gregorian?: string;
}
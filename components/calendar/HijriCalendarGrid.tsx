"use client";

import { useHijriCalendar } from "@/hooks/calendar/use-hijri-calendar";
import HijriCalendarView from "./HijriCalendarView";

export default function HijriCalendarGrid() {
  const state = useHijriCalendar();
  return <HijriCalendarView {...state} />;
}

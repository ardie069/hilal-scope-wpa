"use client";

import { usePrayerTimes } from "@/hooks/prayer/use-prayer-times";
import PrayerTimesView from "./PrayerTimesView";

export default function PrayerTimesClient() {
  const state = usePrayerTimes();
  return <PrayerTimesView {...state} />;
}

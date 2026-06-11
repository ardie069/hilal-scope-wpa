import type { Metadata } from "next";
import PrayerTimesClient from "@/components/prayer/PrayerTimesClient";

export const metadata: Metadata = {
  title: "Jadwal Sholat | Hilal Scope",
  description: "Jadwal sholat akurat berdasarkan lokasi dan berbagai metode perhitungan yang divalidasi dengan kalkulasi astronomi canggih.",
};

export default function PrayerTimesPage() {
  return <PrayerTimesClient />;
}

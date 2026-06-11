"use client";

import { useState } from "react";
import { useTheme } from "@/context/theme-context";
import { useMounted } from "@/hooks/use-mounted";
import { usePrayer } from "@/hooks/use-prayer";
import { formatCoordinates } from "@/lib/utils/maps";

export default function PrayerTimesClient() {
  const { darkMode } = useTheme();
  const mounted = useMounted();
  const [method, setMethod] = useState("KEMENAG");

  const { data, loading, error, lat, lon } = usePrayer(undefined, method);

  if (!mounted) {
    return <div className="min-h-screen bg-background-light" />;
  }

  const prayerNames: Record<string, string> = {
    fajr: "Subuh",
    sunrise: "Terbit",
    dhuhr: "Dzuhur",
    asr: "Ashar",
    maghrib: "Maghrib",
    isha: "Isya",
    midnight: "Tengah Malam",
    third_night: "Sepertiga Malam",
  };

  const methods = [
    { id: "KEMENAG", name: "Kemenag RI" },
    { id: "UMM_AL_QURA", name: "Umm al-Qura (Makkah)" },
    { id: "MWL", name: "Muslim World League" },
    { id: "ISNA", name: "ISNA (Amerika Utara)" },
    { id: "EGYPTIAN", name: "Egyptian General Authority" },
    { id: "KARACHI", name: "University of Islamic Sciences, Karachi" },
  ];

  return (
    <div className="flex flex-col gap-8 lg:gap-12 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md">
            🕌
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors duration-500">
            Jadwal Sholat
          </h1>
        </div>
        <p className="text-sm sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl font-medium">
          Akurasi waktu sholat berdasarkan astronomi presisi dengan berbagai metode kalkulasi.
        </p>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-start gap-4 animate-in fade-in zoom-in duration-500">
              <div className="bg-error text-error-content rounded-xl p-2 shrink-0 shadow-lg shadow-error/20">
                <span className="text-xl font-bold">⚠️</span>
              </div>
              <div>
                <h3 className="font-black text-error">Gagal Memuat Jadwal</h3>
                <p className="text-error/80 text-sm mt-1 leading-relaxed font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {loading && !data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-white/5 rounded-2xl" />
              ))}
            </div>
          )}

          {data && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-8 duration-700">
              {Object.entries(data.times).map(([key, time], index) => {
                const isHighlight = ["fajr", "dhuhr", "asr", "maghrib", "isha"].includes(key);
                return (
                  <div
                    key={key}
                    className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                      isHighlight
                        ? "bg-white/50 dark:bg-card-dark/50 border-gray-100 dark:border-white/10 hover:border-primary/50"
                        : "bg-gray-50/50 dark:bg-white/5 border-transparent opacity-80"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                      {prayerNames[key] || key}
                    </p>
                    <p className={`text-3xl font-black tabular-nums tracking-tighter ${
                      isHighlight ? "text-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "text-gray-900 dark:text-white"
                    }`}>
                      {time}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          
          {data && (
            <div className="flex justify-center items-center py-4">
              <div className="group flex items-center gap-4 px-6 py-3 bg-white/40 dark:bg-card-dark/40 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 shadow-soft hover:shadow-primary/10 transition-all duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <p className="text-[10px] font-black dark:text-primary-content text-base-content/60 uppercase tracking-[0.25em]">
                    Tanggal Hijriyah
                  </p>
                  <div className="hidden sm:block h-3 w-px bg-base-content/10"></div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {data.date.hijri}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6 w-full sticky top-24 animate-in slide-in-from-right-8 duration-700">
          <div className="rounded-2xl p-6 sm:p-8 shadow-card border transition-all duration-500 bg-card-light dark:bg-card-dark border-gray-100 dark:border-gray-800">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">
              Pengaturan Metode
            </h3>
            <div className="flex flex-col gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`px-4 py-3 rounded-xl border text-left text-sm font-bold transition-all ${
                    method === m.id
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {data && (
              <>
                <div className="w-full border-t border-gray-100 dark:border-gray-800 my-6 border-dashed" />
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Lokasi Anda
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5">
                      <span className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Koordinat
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-900 dark:text-white block">
                        {formatCoordinates(data.location.latitude, data.location.longitude)}
                      </span>
                    </div>
                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5">
                      <span className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                        Zona Waktu
                      </span>
                      <span className="font-bold text-xs text-gray-900 dark:text-white block">
                        {data.location.timezone}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

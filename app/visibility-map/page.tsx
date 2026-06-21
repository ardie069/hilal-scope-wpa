"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchVisibilityMap, fetchHijriCalendar, fetchHijriDate } from "@/lib/api/hijri";
import MapControls from "@/components/maps/MapControls";
import { Info, AlertTriangle, MapPin } from "lucide-react";
import { HIJRI_MONTHS_INDONESIA_GRAMMAR, HIJRI_MONTHS_INTERNATIONAL_GRAMMAR } from "@/lib/constants";

const VisibilityMap = dynamic(
  () => import("@/components/maps/VisibilityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[650px] bg-base-300 animate-pulse rounded-3xl flex flex-col items-center justify-center gap-4 border-4 border-primary/5">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm font-bold text-primary/40 uppercase tracking-widest">Memulai Mesin Peta NASA...</p>
      </div>
    )
  }
);

interface HijriMonth {
  name: string;
  date: string;
}

export default function VisibilityMapPage() {
  const [hijriMonths, setHijriMonths] = useState<HijriMonth[]>([]);
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("KHGT"); // Default to KHGT as requested
  const [data, setData] = useState<{
    points: unknown[];
    best_location?: { latitude: number; longitude: number };
    ijtima_time?: string;
    fajar_nz_time?: string;
    month_name?: string;
    year?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize dynamic month (Next Upcoming Observation)
  useEffect(() => {
    const initNextMonth = async () => {
      setLoadingMonths(true);
      try {
        const nowResp = await fetchHijriDate(-6.2, 106.8);
        const { year } = nowResp.data.methods.KHGT.hijri_date;

        const calResp = await fetchHijriCalendar(year, -6.2, 106.8, "KHGT");
        if (calResp.status === "success" && calResp.data?.months) {
          const allMonths = calResp.data.months;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset for comparison

          let targetMonth = null;

          // Scan current year months for upcoming observation
          for (const m of allMonths) {
            const startDate = new Date(m.start_gregorian);
            startDate.setDate(startDate.getDate() - 1); // Observation Night
            if (startDate >= today) {
              targetMonth = m;
              break;
            }
          }

          // If not found in current year, fetch next year's Muharram
          if (!targetMonth) {
            const nextYearResp = await fetchHijriCalendar(year + 1, -6.2, 106.8, "KHGT");
            if (nextYearResp.status === "success") {
              targetMonth = nextYearResp.data.months[0];
            }
          }

          if (targetMonth) {
            // SAFE DATE SHIFTING (Avoiding Local Timezone Offset)
            const [y, m, d] = targetMonth.start_gregorian.split("-").map(Number);
            const dateObj = new Date(Date.UTC(y, m - 1, d));
            dateObj.setUTCDate(dateObj.getUTCDate() - 1);
            const obsDate = dateObj.toISOString().split("T")[0];

            setHijriMonths([{
              name: targetMonth.month_name,
              date: obsDate,
            }]);
            setDate(obsDate);
          }
        }
      } catch {
        setError("Gagal mengambil data kalender Hijriyah.");
      } finally {
        setLoadingMonths(false);
      }
    };
    initNextMonth();
  }, []);

  const loadData = useCallback(async (targetDate: string, targetMethod: string) => {
    if (!targetDate) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchVisibilityMap(targetDate, targetMethod);
      if (resp.status === "success") {
        setData(resp.data);
      } else {
        setError("Gagal memuat data visibilitas.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Kesalahan koneksi ke server astronomi.");
      } else {
        setError("Kesalahan koneksi ke server astronomi.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) {
      loadData(date, method);
    }
  }, [date, method, loadData]);

  const formatHijriMonthIndo = (intlName: string) => {
    const monthIntl = HIJRI_MONTHS_INTERNATIONAL_GRAMMAR.find(m => m.name === intlName);
    if (!monthIntl) return intlName;
    return HIJRI_MONTHS_INDONESIA_GRAMMAR.find(m => m.id === monthIntl.id)?.name || intlName;
  };

  const currentMonthEntry = hijriMonths[0];

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark py-6 sm:py-12 px-0 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-8 sm:mb-12 relative px-4 sm:px-0">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Astronomy Visualisation</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            Peta <span className="text-primary italic">Visibilitas</span> Hilal
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
            Prediksi penampakan hilal di seluruh dunia berdasarkan kriteria astronomi mutakhir.
          </p>
        </div>

        <div className="px-4 sm:px-0 mb-8">
          <MapControls
            date={date}
            method={method}
            onDateChange={setDate}
            onMethodChange={setMethod}
            isLoading={loading || loadingMonths}
            hijriMonths={hijriMonths}
          />
        </div>

        {error && (
          <div className="mx-4 sm:mx-0 alert alert-error shadow-2xl rounded-3xl mb-8 border-2 border-error/20 bg-error/10 text-error-content flex gap-4 p-6">
            <AlertTriangle className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-black text-lg uppercase">Kesalahan Perhitungan</h3>
              <p className="text-sm font-medium opacity-80">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-card-light dark:bg-card-dark p-0 sm:p-5 rounded-none sm:rounded-[2.5rem] shadow-2xl border-y sm:border border-gray-100 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
            <MapPin className="w-40 h-40 text-primary" />
          </div>

          <VisibilityMap
            points={data?.points || []}
            method={method}
            bestLocation={data?.best_location}
            date={date}
          />

          {data?.ijtima_time && (
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-[1001] bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-end gap-1 sm:gap-2">
              <span className="text-[8px] sm:text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">Astronomy Metadata</span>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-tighter">Ijtima:</span>
                <span className="text-[9px] sm:text-[11px] font-black text-primary italic">
                  {new Date(data.ijtima_time).getUTCDate().toString().padStart(2, '0')}/{(new Date(data.ijtima_time).getUTCMonth()+1).toString().padStart(2, '0')} Pkl. {new Date(data.ijtima_time).getUTCHours().toString().padStart(2, '0')}:{new Date(data.ijtima_time).getUTCMinutes().toString().padStart(2, '0')} UTC
                </span>
              </div>

              {method === "KHGT" && data.fajar_nz_time && (
                <>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-tighter">Fajar NZ:</span>
                    <span className="text-[9px] sm:text-[11px] font-black text-secondary italic">
                      {new Date(data.fajar_nz_time).getUTCDate().toString().padStart(2, '0')}/{(new Date(data.fajar_nz_time).getUTCMonth() + 1).toString().padStart(2, '0')} Pkl. {new Date(data.fajar_nz_time).getUTCHours().toString().padStart(2, '0')}:{new Date(data.fajar_nz_time).getUTCMinutes().toString().padStart(2, '0')} UTC
                    </span>
                  </div>

                  <div className="mt-0.5 pt-1 border-t border-gray-100 flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Terpenuhi?</span>
                    <span className={`text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ${new Date(data.ijtima_time).getTime() < new Date(data.fajar_nz_time).getTime() ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                      {new Date(data.ijtima_time).getTime() < new Date(data.fajar_nz_time).getTime() ? 'YA' : 'TIDAK'}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col md:flex-row gap-6 p-6 bg-base-300/30 rounded-3xl border border-primary/5">
            <div className="flex gap-4">
              <div className="bg-primary/20 p-3 rounded-2xl shrink-0 h-fit">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm uppercase tracking-wider">
                  {data?.month_name ? `${formatHijriMonthIndo(data.month_name)} ${data.year} — ` : (currentMonthEntry && `${formatHijriMonthIndo(currentMonthEntry.name)} — `)}Metode {method}
                </h4>
                <p className="text-xs text-base-content/60 font-medium leading-relaxed">
                  {method === "ODEH" && "Membandingkan elongasi hilal dengan lebar sabit (crescent width) minimum untuk bisa terlihat (Metode Odeh 2006)."}
                  {method === "KHGT" && "Kriteria Hilal Global Terpadu (Alt >= 5° dan Elong >= 8°). Menampilkan zona sebelum dan sesudah 00 UTC sesuai keputusan Kongres Turki 2016."}
                </p>
              </div>
            </div>
            <div className="md:border-l md:border-primary/10 md:pl-6 space-y-2">
              <h4 className="font-black text-sm uppercase tracking-wider">Status Data</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-bold text-success/80">NASA JPL DE440s Active</span>
              </div>
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.1em]">
                Real-time astronomi backend
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

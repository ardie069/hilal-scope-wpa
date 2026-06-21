"use client";

import type { HilalPrediction, MethodKey, HijriDate } from "@/types/hijri";
import IjtimaInfo from "./prediction/IjtimaInfo";
import TelemetryStats from "./prediction/TelemetryStats";
import KHGTParams from "./prediction/KHGTParams";
import MoonsetParams from "./prediction/MoonsetParams";
import NextMonthSummary from "./prediction/NextMonthSummary";

interface HijriPredictionProps {
  prediction: HilalPrediction;
  method: MethodKey;
  title?: string;
  isLocal?: boolean;
  hijriDate?: HijriDate;
  referencePassed?: boolean;
}

export default function HijriPrediction({
  prediction, method, title, isLocal = false, hijriDate, referencePassed,
}: HijriPredictionProps) {
  const isArithmetic = method === "TABULAR";

  let altWarning = false, altDanger = false;
  const elongWarning = false;
  let elongDanger = false, elongGeoWarning = false, elongGeoDanger = false;

  const alt = prediction.altitude;
  const elong = prediction.elongation;
  const elongGeo = prediction.elongation_geo ?? elong;

  if (method === "MABIMS") {
    const altFails = alt < 3.0;
    const elongGeoFails = elongGeo < 6.4;
    if (isLocal && referencePassed) {
      if (altFails) altWarning = true;
      if (elongGeoFails) elongGeoWarning = true;
    } else {
      if (altFails) altDanger = true;
      if (elongGeoFails) elongGeoDanger = true;
    }
  } else if (method === "KHGT") {
    if (alt < 5.0) altDanger = true;
    if (elong < 8.0) elongDanger = true;
  } else if (method === "UMM_AL_QURA") {
    if (!prediction.is_new_month) {
      altDanger = true; elongDanger = true; elongGeoDanger = true;
    }
  }

  return (
    <div className="group relative animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className={`absolute -inset-1 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 ${
        isLocal
          ? "bg-linear-to-tr from-amber-500/10 via-orange-500/5 to-rose-500/10"
          : "bg-linear-to-tr from-indigo-500/10 via-primary/5 to-emerald-500/10"
      }`} />

      <div className={`relative overflow-hidden bg-white/40 dark:bg-card-dark/40 backdrop-blur-3xl p-5 sm:p-8 md:p-10 rounded-2xl border transition-all duration-500 ${
        isLocal
          ? "border-amber-500/20 dark:border-amber-500/10 shadow-[0_8px_32px_0_rgba(245,158,11,0.05)]"
          : "border-white/40 dark:border-white/5 shadow-soft"
      }`}>
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">
              {title || (isArithmetic ? "Sistem Penanggalan Tabular" : "Prediksi Hilal Akhir Bulan Ini")}
            </h3>
          </div>
          <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${
            prediction.is_new_month
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
          }`}>
            {prediction.is_new_month ? "Kemungkinan Memasuki Bulan Baru" : "Digenapkan Menjadi 30 Hari"}
          </div>
        </header>

        {!isArithmetic && <IjtimaInfo prediction={prediction} method={method} />}

        {!isArithmetic && (
          <div className="pt-8 border-t border-gray-100 dark:border-white/5">
            <TelemetryStats
              prediction={prediction} method={method} isLocal={isLocal} referencePassed={referencePassed}
              altDanger={altDanger} altWarning={altWarning}
              elongDanger={elongDanger} elongWarning={elongWarning}
              elongGeoDanger={elongGeoDanger} elongGeoWarning={elongGeoWarning}
            />
            {method === "KHGT" && <KHGTParams prediction={prediction} />}
            {method === "UMM_AL_QURA" && <MoonsetParams prediction={prediction} variant="UMM_AL_QURA" />}
            {method === "MABIMS" && <MoonsetParams prediction={prediction} variant="MABIMS" />}
          </div>
        )}

        {hijriDate && prediction.check_date_utc && (
          <NextMonthSummary prediction={prediction} hijriDate={hijriDate} method={method} isLocal={isLocal} />
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center px-4">
          <p className="text-[10px] sm:text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 max-w-2xl mx-auto font-medium">
            <span className="font-bold uppercase tracking-wider block mb-2 opacity-50">Penafian (Disclaimer)</span>
            Hasil perhitungan ini hanya merupakan simulasi astronomi otomatis dan bukan merupakan penentu mutlak
            penetapan awal bulan Hijriyah. Keputusan resmi terkait awal bulan tetap menunggu ketetapan otoritas
            berwenang yang disahkan melalui Sidang Isbat atau pengumuman resmi organisasi terkait.
          </p>
        </div>
      </div>
    </div>
  );
}

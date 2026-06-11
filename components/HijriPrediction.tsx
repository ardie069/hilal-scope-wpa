"use client";

import type { HilalPrediction, MethodKey, HijriDate } from "@/types/hijri";
import { formatCoordinates } from "@/lib/utils/maps";
import { formatDegreeDMS, formatMoonAgeHM, formatSunsetCheck } from "@/lib/utils/astronomy-format";
import { getHijriMonthName } from "@/lib/utils/hijri";

interface HijriPredictionProps {
  prediction: HilalPrediction;
  method: MethodKey;
  title?: string;
  isLocal?: boolean;
  hijriDate?: HijriDate;
  referencePassed?: boolean;
}

export default function HijriPrediction({
  prediction,
  method,
  title,
  isLocal = false,
  hijriDate,
  referencePassed,
}: HijriPredictionProps) {
  const isArithmetic = method === "TABULAR";

  // Evaluasi warna parameter berdasarkan metode
  let altWarning = false;
  let altDanger = false;
  let elongWarning = false;
  let elongDanger = false;

  const alt = prediction.altitude;
  const elong = prediction.elongation;

  if (method === "MABIMS") {
    const altFails = alt < 3.0; // MABIMS minimal 3 derajat
    const elongFails = elong < 6.4; // MABIMS minimal 6.4 derajat

    if (isLocal && referencePassed) {
      if (altFails) altWarning = true;
      if (elongFails) elongWarning = true;
    } else {
      if (altFails) altDanger = true;
      if (elongFails) elongDanger = true;
    }
  } else if (method === "KHGT") {
    if (alt < 5.0) altDanger = true; // KHGT minimal 5 derajat
    if (elong < 8.0) elongDanger = true; // KHGT minimal 8 derajat
  } else if (method === "UMM_AL_QURA") {
    if (!prediction.is_new_month) {
      // Umm al-Qura jika tidak memenuhi syarat maka keduanya merah
      altDanger = true;
      elongDanger = true;
    }
  }

  return (
    <div className="group relative animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Aura Glow - Proyeksi Masa Depan */}
      <div className={`absolute -inset-1 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 ${isLocal
          ? "bg-linear-to-tr from-amber-500/10 via-orange-500/5 to-rose-500/10"
          : "bg-linear-to-tr from-indigo-500/10 via-primary/5 to-emerald-500/10"
        }`}></div>

      <div className={`relative overflow-hidden bg-white/40 dark:bg-card-dark/40 backdrop-blur-3xl p-5 sm:p-8 md:p-10 rounded-2xl border transition-all duration-500 ${isLocal
          ? "border-amber-500/20 dark:border-amber-500/10 shadow-[0_8px_32px_0_rgba(245,158,11,0.05)]"
          : "border-white/40 dark:border-white/5 shadow-soft"
        }`}>
        {/* Header: Status Proyeksi */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">
              {title || (isArithmetic ? "Sistem Penanggalan Tabular" : "Prediksi Hilal Akhir Bulan Ini")}
            </h3>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all duration-500
              ${prediction.is_new_month
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
              }`}
          >
            {prediction.is_new_month
              ? "Kemungkinan Memasuki Bulan Baru"
              : "Digenapkan Menjadi 30 Hari"
            }
          </div>
        </header>

        {/* Prediction Detail */}
        {/* Ijtima & Age */}
        {!isArithmetic && (
          <>
            <section className="mb-6 sm:mb-10 relative overflow-hidden p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-linear-to-br from-primary/10 to-emerald-500/5 border border-primary/10 shadow-inner group/result">
              <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-20 transition-transform duration-3000 group-hover/result:rotate-180">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M50 5L50 15M50 85L50 95M5 50L15 50M85 50L95 50"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-[9px] uppercase opacity-50 font-black mb-3 tracking-[0.3em] text-primary">
                  Estimasi Matahari Terbenam pada Akhir Bulan
                </p>
                <h4 className="text-base sm:text-lg md:text-xl font-black text-primary tracking-tighter mb-1">
                  {formatSunsetCheck(prediction.check_date_local, prediction.timezone_name)}
                </h4>
              </div>
            </section>

            <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-white/50 dark:bg-white/3 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">
                    Usia Bulan
                  </p>
                  <p className="text-base font-black text-gray-900 dark:text-white tabular-nums">
                    {formatMoonAgeHM(prediction.age_hours)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">
                    Ijtimak (Konjungsi)
                  </p>
                  <p className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400">
                    {new Date(prediction.ijtima_time).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone:
                        method === "KHGT"
                          ? "UTC"
                          : method === "UMM_AL_QURA"
                            ? "Asia/Riyadh"
                            : undefined,
                      timeZoneName: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Telemetry Grid */}
        {!isArithmetic && (
          <div className="pt-8 border-t border-gray-100 dark:border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <Stat
                label="Ketinggian Hilal"
                value={formatDegreeDMS(prediction.altitude)}
                isPrimary={!altDanger && !altWarning}
                isDanger={altDanger}
                isWarning={altWarning}
              />
              <Stat
                label="Elongasi"
                value={formatDegreeDMS(prediction.elongation)}
                isDanger={elongDanger}
                isWarning={elongWarning}
              />
            </div>

            {prediction.altitude_apparent !== undefined && (
              <div className="mb-8">
                <Stat
                  label="Ketinggian Hilal (Apparent)"
                  value={formatDegreeDMS(prediction.altitude_apparent)}
                />
              </div>
            )}

            {prediction.location && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-transparent">
                <div className="space-y-1">
                  <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.3em]">
                    {isLocal ? "Titik Observasi Anda" : "Titik Observasi"}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-gray-600 dark:text-gray-400">
                    {formatCoordinates(
                      prediction.location.latitude,
                      prediction.location.longitude,
                    )}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg shrink-0 border transition-all ${
                  prediction.is_new_month
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : (method === "MABIMS" && isLocal && referencePassed)
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                }`}>
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    {prediction.is_new_month
                      ? "✓ Kriteria Terpenuhi"
                      : (method === "MABIMS" && isLocal && referencePassed)
                        ? "⚠ Tidak Memenuhi Kriteria"
                        : "✕ Tidak Memenuhi Kriteria"}
                  </p>
                </div>
              </div>
            )}

            {/* KHGT Specific Parameters */}
            {method === "KHGT" && prediction.khgt_global_valid !== undefined && (
              <div className="flex flex-col gap-3 p-5 sm:p-6 mt-6 sm:mt-8 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 shadow-sm animate-in zoom-in-95 duration-500">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-2">
                  Pemenuhan Parameter Global (KHGT)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${prediction.khgt_global_valid
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-white/5 border-transparent text-gray-400"
                    }`}>
                    <span className="text-sm">{prediction.khgt_global_valid ? "✓" : "✕"}</span>
                    <span className="text-[11px] font-bold">Imkan Rukyat Global (Ketinggian &gt;= 5° &amp; Elongasi &gt;= 8°)</span>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${prediction.khgt_america_exception
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                      : "bg-gray-100 dark:bg-white/5 border-transparent text-gray-400"
                    }`}>
                    <span className="text-sm">{prediction.khgt_america_exception ? "✓" : "✕"}</span>
                    <span className="text-[11px] font-bold">Pengecualian Benua Amerika (Ijtimak Sebelum Subuh di Selandia Baru)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Umm al-Qura Specific Parameters */}
            {method === "UMM_AL_QURA" && prediction.moonset_time_local && prediction.moonset_diff_minutes !== undefined && (
              <div className="flex flex-col gap-3 p-5 sm:p-6 mt-6 sm:mt-8 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 shadow-sm animate-in zoom-in-95 duration-500">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600 dark:text-teal-400 mb-2">
                  Pemenuhan Parameter Umm al-Qura (Makkah)
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col p-3 rounded-xl border bg-gray-100 dark:bg-white/5 border-transparent">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Matahari Terbenam</span>
                    <span className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-300">{prediction.check_date_local.split(' ')[1]}</span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl border bg-gray-100 dark:bg-white/5 border-transparent">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bulan Terbenam</span>
                    <span className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-300">{prediction.moonset_time_local.split(' ')[1]}</span>
                  </div>
                </div>

                <div className={`mt-2 flex items-center justify-center gap-2 p-3 rounded-xl text-[11px] font-bold border transition-colors ${
                  prediction.moonset_diff_minutes > 0
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                }`}>
                  {prediction.moonset_diff_minutes > 0 
                    ? `✓ Bulan terbenam ${Math.abs(Math.round(prediction.moonset_diff_minutes))} menit setelah matahari`
                    : `✕ Bulan terbenam ${Math.abs(Math.round(prediction.moonset_diff_minutes))} menit sebelum matahari`}
                </div>
              </div>
            )}


            {/* MABIMS Specific Parameters */}
            {method === "MABIMS" && prediction.moonset_time_local && prediction.moonset_diff_minutes !== undefined && (
              <div className="flex flex-col gap-3 p-5 sm:p-6 mt-6 sm:mt-8 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 shadow-sm animate-in zoom-in-95 duration-500">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400 mb-2">
                  Tambahan Pendukung Visibilitas (MABIMS)
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col p-3 rounded-xl border bg-gray-100 dark:bg-white/5 border-transparent">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Matahari Terbenam</span>
                    <span className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-300">{prediction.check_date_local.split(' ')[1]}</span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl border bg-gray-100 dark:bg-white/5 border-transparent">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bulan Terbenam</span>
                    <span className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-300">{prediction.moonset_time_local.split(' ')[1]}</span>
                  </div>
                </div>

                <div className={`mt-2 flex items-center justify-center gap-2 p-3 rounded-xl text-[11px] font-bold border transition-colors ${
                  prediction.moonset_diff_minutes > 0
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                }`}>
                  {prediction.moonset_diff_minutes > 0 
                    ? `Bulan terbenam ${Math.abs(Math.round(prediction.moonset_diff_minutes))} menit setelah matahari`
                    : `Bulan terbenam ${Math.abs(Math.round(prediction.moonset_diff_minutes))} menit sebelum matahari`}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Month Gregorian Projection Summary */}
        {hijriDate && prediction.check_date_utc && (
          <div className={`mt-8 p-5 sm:p-6 rounded-2xl border ${isLocal ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10'} text-center animate-in mb-2 shadow-sm`}>
            {(() => {
              const checkDate = new Date(prediction.check_date_utc);
              const daysToAdd = prediction.is_new_month ? 1 : 2;
              checkDate.setDate(checkDate.getDate() + daysToAdd);
              
              const nextMonthIdx = (hijriDate.month % 12) + 1;
              const nextMonthName = getHijriMonthName(nextMonthIdx);
              const nextYear = hijriDate.month === 12 ? hijriDate.year + 1 : hijriDate.year;

              const projectedGregorian = checkDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              });

              return (
                <p className="text-[13px] sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className={`font-black ${isLocal ? 'text-amber-600 dark:text-amber-500' : 'text-primary'}`}>
                    1 {nextMonthName} {nextYear} H
                  </span>
                  {" "}kemungkinan akan dimulai pada tanggal{" "}
                  <span className="font-black border-b border-gray-300 dark:border-gray-600 pb-0.5">{projectedGregorian}</span>.
                  <br/>
                  <span className="text-[10px] sm:text-[11px] opacity-70 mt-3 block mx-auto max-w-sm">
                    {method === "TABULAR" 
                      ? "Catatan: Metode Tabular mengambil perhitungan sesuai referensi tabular (deret aritmatika statis)."
                      : method === "KHGT"
                      ? "Sesuai kriteria KHGT (Turki 2016) yang divalidasi berdasarkan ketersediaan hilal di seluruh belahan bumi."
                      : "Sesuai kalkulasi simulasi elongasi dan visibilitas hilal yang telah divalidasi dengan referensi kriteria metode saat ini."}
                  </span>
                </p>
              );
            })()}
          </div>
        )}

        {/* Footer: Tech Hint */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center px-4">
          <p className="text-[10px] sm:text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 max-w-2xl mx-auto font-medium">
            <span className="font-bold uppercase tracking-wider block mb-2 opacity-50">Penafian (Disclaimer)</span>
            Hasil perhitungan ini hanya merupakan simulasi astronomi otomatis dan bukan merupakan penentu mutlak penetapan awal bulan Hijriyah. 
            Keputusan resmi terkait awal bulan tetap menunggu ketetapan otoritas berwenang yang disahkan melalui Sidang Isbat atau pengumuman resmi organisasi terkait.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  isPrimary = false,
  isDanger = false,
  isWarning = false,
}: {
  label: string;
  value: string;
  isPrimary?: boolean;
  isDanger?: boolean;
  isWarning?: boolean;
}) {
  let textColor = "text-gray-900 dark:text-white";
  if (isDanger) {
    textColor = "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.2)]";
  } else if (isWarning) {
    textColor = "text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]";
  } else if (isPrimary) {
    textColor = "text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]";
  }

  let markerColor = "bg-gray-200 dark:bg-white/20";
  if (isDanger) markerColor = "bg-rose-500";
  else if (isWarning) markerColor = "bg-amber-500";
  else if (isPrimary) markerColor = "bg-primary";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1 h-3 rounded-full ${markerColor}`}></div>
        <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em] m-0">
          {label}
        </p>
      </div>
      <p
        className={`text-xl sm:text-2xl font-black tabular-nums tracking-tighter transition-colors ${textColor}`}
      >
        {value}
      </p>
    </div>
  );
}

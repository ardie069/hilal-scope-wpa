"use client";

import HijriInfoCard from "./HijriInfoCard";
import HijriPrediction from "./HijriPrediction";
import HijriSkeleton from "./HijriSkeleton";
import { formatGeneratedTime } from "@/lib/utils/timezone";
import type { MethodKey, MethodResult } from "@/types/hijri";

interface HijriDateProps {
  methodResult: MethodResult | null;
  weton: string | null;
  loading: boolean;
  error: string | null;
  method: MethodKey;
  gregorianDate?: string;
  children?: React.ReactNode;
}

export default function HijriDate({
  methodResult,
  weton,
  loading,
  error,
  method,
  gregorianDate,
  children,
}: HijriDateProps) {
  if ((loading && !methodResult) || (!methodResult && !error))
    return <HijriSkeleton />;

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-start gap-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-error text-error-content rounded-xl p-2 shrink-0 shadow-lg shadow-error/20">
          <span className="text-xl font-bold">⚠️</span>
        </div>
        <div>
          <h3 className="font-black text-error">Gagal Sinkronisasi</h3>
          <p className="text-error/80 text-sm mt-1 leading-relaxed font-medium">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!methodResult) return null;

  const hijriDate = methodResult.hijri_date;
  const prediction = methodResult.prediction;
  const localPrediction = methodResult.local_prediction;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-1 sm:px-0">
      {/* 1. Main Display: Fokus pada Identitas Waktu */}
      <HijriInfoCard hijriDate={hijriDate} weton={weton} method={method} />

      {/* 2. Middle Content Slot (Selection UI for Mobile) */}
      {children}

      {/* 2. Telemetry Section */}
      {(method === "MABIMS" || method === "UMM_AL_QURA") &&
        methodResult.current_altitude !== undefined && (
        <div className="relative group animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
          <div className="absolute -inset-2 bg-linear-to-br from-primary/5 via-transparent to-emerald-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative overflow-hidden bg-white/40 dark:bg-card-dark/40 backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] transition-all hover:shadow-primary/5">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                  {method === "UMM_AL_QURA" ? "Data Astronomi Makkah" : "Data Astronomi Real-time"}
                </h3>
              </div>

              {method === "MABIMS" && methodResult.reference_altitude !== undefined ? (
                <div className="flex flex-col gap-8">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-gray-400 mb-4 tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">
                      Lokasi Anda
                    </p>
                    <div className="grid grid-cols-2 gap-6 sm:gap-10">
                      <Stat
                        label="Tinggi Hilal"
                        value={`${methodResult.current_altitude?.toFixed(2)}°`}
                        isPrimary
                      />
                      <Stat
                        label="Jarak Elongasi"
                        value={`${methodResult.current_elongation?.toFixed(2)}°`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[9px] uppercase font-bold text-gray-400 mb-4 tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">
                      Titik Referensi (Sabang)
                    </p>
                    <div className="grid grid-cols-2 gap-6 sm:gap-10">
                      <Stat
                        label="Tinggi Hilal"
                        value={`${methodResult.reference_altitude?.toFixed(2)}°`}
                        isPrimary
                      />
                      <Stat
                        label="Jarak Elongasi"
                        value={`${methodResult.reference_elongation?.toFixed(2)}°`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:gap-10">
                  <Stat
                    label="Tinggi Hilal"
                    value={`${methodResult.current_altitude?.toFixed(2)}°`}
                    isPrimary
                  />
                  <Stat
                    label="Jarak Elongasi"
                    value={`${methodResult.current_elongation?.toFixed(2)}°`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Prediction Section */}
      {prediction && (
        <section className="relative group animate-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-emerald-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative space-y-4">
            <HijriPrediction 
              prediction={prediction} 
              method={method} 
              title={localPrediction ? "Prediksi Titik Referensi (Sabang)" : undefined}
              hijriDate={hijriDate}
            />

            {localPrediction && (
              <HijriPrediction 
                prediction={localPrediction} 
                method={method} 
                title="Prediksi Titik Observasi Anda" 
                isLocal 
                hijriDate={hijriDate}
                referencePassed={prediction.is_new_month}
              />
            )}
          </div>
        </section>
      )}

      {/* 4. Live Synchronization Status */}
      {gregorianDate && (
        <div className="flex justify-center items-center py-4">
          <div className="group flex items-center gap-4 px-6 py-3 bg-white/40 dark:bg-card-dark/40 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 shadow-soft hover:shadow-primary/10 transition-all duration-500">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="text-[10px] font-black dark:text-primary-content text-base-content/60 uppercase tracking-[0.25em]">
                Sinkronisasi
              </p>
              <div className="hidden sm:block h-3 w-px bg-base-content/10"></div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Terakhir Diperbarui: {formatGeneratedTime(gregorianDate)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  isPrimary = false,
}: {
  label: string;
  value: string;
  isPrimary?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className={`w-1 h-3 rounded-full ${isPrimary ? "bg-primary" : "bg-gray-200 dark:bg-white/20"}`}
        ></div>
        <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>
      <p
        className={`text-2xl sm:text-4xl font-black tabular-nums tracking-tighter transition-all ${isPrimary ? "text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "text-gray-900 dark:text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

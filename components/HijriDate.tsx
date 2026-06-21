"use client";

import HijriInfoCard from "./HijriInfoCard";
import HijriPrediction from "./HijriPrediction";
import HijriSkeleton from "./HijriSkeleton";
import HijriTelemetry from "./HijriTelemetry";
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
  methodResult, weton, loading, error, method, gregorianDate, children,
}: HijriDateProps) {
  if ((loading && !methodResult) || (!methodResult && !error)) return <HijriSkeleton />;

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-start gap-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-error text-error-content rounded-xl p-2 shrink-0 shadow-lg shadow-error/20">
          <span className="text-xl font-bold">⚠️</span>
        </div>
        <div>
          <h3 className="font-black text-error">Gagal Sinkronisasi</h3>
          <p className="text-error/80 text-sm mt-1 leading-relaxed font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!methodResult) return null;

  const { hijri_date: hijriDate, prediction, local_prediction: localPrediction } = methodResult;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-1 sm:px-0">
      <HijriInfoCard hijriDate={hijriDate} weton={weton} method={method} />

      {children}

      <HijriTelemetry methodResult={methodResult} method={method} />

      {prediction && (
        <section className="relative group animate-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-emerald-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
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

      {gregorianDate && (
        <div className="flex justify-center items-center py-4">
          <div className="group flex items-center gap-4 px-6 py-3 bg-white/40 dark:bg-card-dark/40 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 shadow-soft hover:shadow-primary/10 transition-all duration-500">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sinkronisasi</p>
              <div className="hidden sm:block h-3 w-px bg-gray-300 dark:bg-gray-700" />
              <p className="text-sm font-medium text-primary">
                Terakhir Diperbarui: {formatGeneratedTime(gregorianDate)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

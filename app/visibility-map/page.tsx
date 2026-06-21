"use client";

import dynamic from "next/dynamic";
import MapControls from "@/components/maps/MapControls";
import VisibilityMetadata from "@/components/maps/VisibilityMetadata";
import VisibilityInfoBar from "@/components/maps/VisibilityInfoBar";
import { useVisibilityMap } from "@/hooks/use-visibility-map";
import { AlertTriangle, MapPin } from "lucide-react";

const VisibilityMap = dynamic(() => import("@/components/maps/VisibilityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] bg-base-300 animate-pulse rounded-3xl flex flex-col items-center justify-center gap-4 border-4 border-primary/5">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-sm font-bold text-primary/40 uppercase tracking-widest">Memulai Mesin Peta NASA...</p>
    </div>
  ),
});

export default function VisibilityMapPage() {
  const { hijriMonths, date, method, setMethod, data, loading, loadingMonths, error } = useVisibilityMap();
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
            method={method}
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

        <div className="bg-card-light dark:bg-card-dark p-0 sm:p-5 rounded-none sm:rounded-4xl shadow-2xl border-y sm:border border-gray-100 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
            <MapPin className="w-40 h-40 text-primary" />
          </div>

          <VisibilityMap points={data?.points || []} method={method} bestLocation={data?.best_location} date={date} />

          {data?.ijtima_time && <VisibilityMetadata data={data} method={method} />}

          <VisibilityInfoBar data={data} method={method} currentMonthEntry={currentMonthEntry} />
        </div>
      </div>
    </main>
  );
}

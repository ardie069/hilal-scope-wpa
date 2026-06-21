"use client";

import { Calendar, Layers, Map as MapIcon } from "lucide-react";
import { HIJRI_MONTHS_INDONESIA_GRAMMAR, HIJRI_MONTHS_INTERNATIONAL_GRAMMAR } from "@/lib/constants";

interface HijriMonth {
  name: string;
  date: string;
}

interface MapControlsProps {
  method: string;
  onMethodChange: (method: string) => void;
  isLoading: boolean;
  hijriMonths: HijriMonth[];
}

export default function MapControls({
  method,
  onMethodChange,
  isLoading,
  hijriMonths,
}: MapControlsProps) {
  const methods = ["KHGT", "ODEH"];
  const currentMonth = hijriMonths[0];

  const formatHijriMonthIndo = (intlName: string) => {
    const monthIntl = HIJRI_MONTHS_INTERNATIONAL_GRAMMAR.find(m => m.name === intlName);
    if (!monthIntl) return intlName;
    return HIJRI_MONTHS_INDONESIA_GRAMMAR.find(m => m.id === monthIntl.id)?.name || intlName;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-base-200/50 p-6 rounded-3xl border border-primary/10 backdrop-blur-sm self-stretch items-center justify-between shadow-xl">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-primary/70 flex items-center gap-2 px-1 uppercase tracking-widest">
            <Calendar className="w-3 h-3" /> Hilal Bulan Berikutnya
          </label>
          <div className="flex items-center gap-3 bg-base-100/50 px-4 py-3 rounded-2xl border-2 border-primary/10 shadow-inner group transition-all hover:border-primary/30 min-w-[200px]">
            <span className="text-sm font-black text-primary uppercase">
              {currentMonth?.name ? formatHijriMonthIndo(currentMonth.name) : "Memuat..."}
            </span>
          </div>
        </div>

        <div className="divider divider-horizontal hidden sm:flex"></div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-primary/70 flex items-center gap-2 px-1 uppercase tracking-widest">
            <Layers className="w-3 h-3" /> Metode Visibilitas
          </label>
          <div className="flex bg-base-300 p-1 rounded-2xl border-2 border-primary/5">
            {methods.map((m) => (
              <button
                key={m}
                onClick={() => onMethodChange(m)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  method === m
                    ? "bg-primary text-primary-content shadow-lg scale-105"
                    : "hover:bg-primary/10 text-base-content/60"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoading && (
          <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 animate-pulse">
            <span className="loading loading-ring loading-sm text-primary"></span>
            <span className="text-xs font-bold text-primary/80 uppercase tracking-tighter">Menghitung...</span>
          </div>
        )}
        <div className="bg-primary/20 p-3 rounded-2xl shadow-lg border border-primary/10">
           <MapIcon className={`w-6 h-6 text-primary ${isLoading ? 'animate-spin' : ''}`} />
        </div>
      </div>
    </div>
  );
}

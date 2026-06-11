"use client";

import type { MoonTelemetry } from "@/types/moon";
import DataRow from "./DataRow";
import { formatDegreeDMS, formatMoonAgeHM } from "@/lib/utils/astronomy-format";

interface MoonSidebarProps {
  telemetry?: MoonTelemetry;
}

export default function MoonSidebar({
  telemetry,
}: MoonSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000">
      {/* --- Ephemeris Data List: Telemetry --- */}
      <div className="bg-white/40 dark:bg-card-dark/40 backdrop-blur-xl p-5 sm:p-8 rounded-2xl border border-white/40 dark:border-white/5 shadow-soft transition-all duration-500 hover:border-primary/20 relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute -bottom-4 -right-4 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
          >
            <path d="M10 90 Q 50 10 90 90" strokeWidth="2" />
          </svg>
        </div>

        <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-8 relative z-10">
          Detail Efemeris
        </h3>
        <ul className="space-y-6 relative z-10">
          <DataRow
            label="Sudut Azimut"
            value={formatDegreeDMS(telemetry?.azimuth, 0)}
            sub="Ref: Utara"
          />
          <DataRow
            label="Tinggi (Alt)"
            value={formatDegreeDMS(telemetry?.altitude)}
            sub={(telemetry?.altitude ?? 0) > 0 ? "Bulan di atas ufuk" : "Bulan di bawah ufuk"}
          />
          <DataRow
            label="Jarak Bumi"
            value={`${Math.round(telemetry?.distance_km ?? 0).toLocaleString()} km`}
            sub="Geosentris"
          />
          <DataRow
            label="Usia Bulan"
            value={formatMoonAgeHM(telemetry?.age_hours)}
            sub="Siklus Baru"
          />
          <DataRow
            label="Fase"
            value={telemetry?.phase_name ?? "-"}
            sub="Siklus"
          />
          <DataRow
            label="Cahaya"
            value={`${telemetry?.illumination.toFixed(1) ?? "0.0"}%`}
            sub="Intensitas"
          />
        </ul>
      </div>

      {/* --- Wisdom Quote Section: The Spiritual Pulse --- */}
      <div className="p-5 sm:p-8 rounded-2xl bg-emerald-500/5 border border-primary/10 relative overflow-hidden group transition-all duration-700">
        {/* Giant Quote Mark Decoration */}
        <div className="absolute -top-4 -right-2 text-8xl font-black text-primary/10 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-1000 select-none">
          <q></q>
        </div>

        <div className="flex flex-col gap-4 relative z-10">
          <div className="h-px w-8 bg-primary/40" />
          <p className="text-sm font-bold italic text-emerald-800 dark:text-emerald-300 leading-relaxed">
            <q>
              Dan Dialah yang menjadikan matahari bersinar dan bulan bercahaya
              dan ditetapkan-Nya manzilah-manzilah (tempat-tempat) bagi
              perjalanan bulan itu...
            </q>
          </p>
          <p className="text-[9px] font-black text-primary mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            QS. Yunus: 5
          </p>
        </div>
      </div>
    </aside>
  );
}

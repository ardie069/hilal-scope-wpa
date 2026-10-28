"use client";

import { ArrowUpFromLine, Radius, Sunrise, Sunset } from "lucide-react";
import Metric from "./Metric";
import StatCard from "./StatCard";
import MoonPhaseVisualization from "./MoonPhaseVisualization";
import { formatDegreeDMS, formatMoonAgeHM } from "@/lib/utils/astronomy-format";

interface MoonVisualizationProps {
  illumination: number;
  phaseName: string;
  age: number;
  distance: number;
  elongation: number;
  elongationGeo?: number;
  altitude: number;
  moonrise?: string;
  moonset?: string;
  lat: number;
}

export default function MoonVisualizationCard({
  illumination = 0,
  phaseName = "Loading...",
  age = 0,
  distance = 0,
  elongation = 0,
  elongationGeo,
  altitude = 0,
  moonrise,
  moonset,
  lat = 0,
}: MoonVisualizationProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="bg-white/60 dark:bg-card-dark/40 backdrop-blur-3xl p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/40 dark:border-white/5 shadow-soft overflow-hidden relative group transition-all duration-500">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-12">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Lansekap Bulan
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                Observer: {lat >= 0 ? "Northern" : "Southern"} Hemisphere
              </p>
            </div>
            <span className="badge badge-primary font-black text-[10px] py-3 px-4 rounded-full uppercase tracking-widest">
              {phaseName}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16 justify-center">
            <MoonPhaseVisualization illumination={illumination} phaseName={phaseName} lat={lat} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 sm:gap-y-10 sm:gap-x-8 w-full max-w-sm">
              <Metric
                label="Cahaya Hilal"
                value={`${illumination.toFixed(1)}%`}
                sub="Intensitas"
              />
              <Metric
                label="Usia Bulan"
                value={formatMoonAgeHM(age)}
                sub="Siklus"
              />
              <Metric
                label="Jarak Bumi"
                value={`${Math.round(distance ?? 0).toLocaleString()} km`}
                sub="Geosentris"
              />
              <Metric
                label="Jarak Sudut"
                value={formatDegreeDMS(elongation)}
                sub="Elongasi Toposentris"
              />
            </div>
          </div>

          <div className="mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-100 dark:border-white/5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40 mb-3">
              <span>Baru</span>
              <span className="text-primary opacity-100 uppercase tracking-widest font-black">
                Siklus
              </span>
              <span>Purnama</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] rounded-full transition-all duration-1000"
                style={{ width: `${illumination}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          icon={<ArrowUpFromLine />}
          label="Tinggi Hilal"
          value={formatDegreeDMS(altitude)}
          desc={
            altitude > 0
              ? "Posisi hilal berada di atas ufuk."
              : "Hilal berada di bawah ufuk."
          }
          footer="Live Telemetry"
          isSuccess={altitude > 0}
        />

        <StatCard
          icon={<Radius />}
          label="Sudut Elongasi"
          value={formatDegreeDMS(elongation)}
          desc={elongationGeo !== undefined ? `Geosentris: ${formatDegreeDMS(elongationGeo)}` : "Jarak sudut antara bulan dan matahari."}
          footer="Data Toposentris"
          progress={100}
        />

        <StatCard
          icon={<Sunrise />}
          label="Waktu Terbit"
          value={moonrise ? new Date(moonrise).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}
          desc="Estimasi waktu terbit bulan di ufuk timur."
          footer="Moonrise Time"
        />

        <StatCard
          icon={<Sunset />}
          label="Waktu Terbenam"
          value={moonset ? new Date(moonset).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}
          desc="Estimasi waktu terbenam bulan di ufuk barat."
          footer="Moonset Time"
        />
      </div>
    </div>
  );
}

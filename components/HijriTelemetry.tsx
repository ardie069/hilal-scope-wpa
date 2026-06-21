import type { MethodResult, MethodKey } from "@/types/hijri";

interface StatProps {
  label: string;
  value: string;
  isPrimary?: boolean;
}

function Stat({ label, value, isPrimary = false }: StatProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className={`w-1 h-3 rounded-full ${isPrimary ? "bg-primary" : "bg-gray-200 dark:bg-white/20"}`} />
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={`text-2xl sm:text-4xl font-black tabular-nums tracking-tighter transition-all ${isPrimary ? "text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "text-gray-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}

interface Props {
  methodResult: MethodResult;
  method: MethodKey;
}

export default function HijriTelemetry({ methodResult, method }: Props) {
  if (methodResult.current_altitude === undefined) return null;
  if (method !== "MABIMS" && method !== "UMM_AL_QURA") return null;

  const hasRef = method === "MABIMS" && methodResult.reference_altitude !== undefined;

  return (
    <div className="relative group animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
      <div className="absolute -inset-2 bg-linear-to-br from-primary/5 via-transparent to-emerald-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
      <div className="relative overflow-hidden bg-white/40 dark:bg-card-dark/40 backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] transition-all hover:shadow-primary/5">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-2 w-2 bg-primary rounded-full" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {method === "UMM_AL_QURA" ? "Data Astronomi Makkah" : "Data Astronomi Real-time"}
            </h3>
          </div>

          {hasRef ? (
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-100 dark:border-white/5 pb-2">
                  Lokasi Anda
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
                  <Stat label="Tinggi Hilal" value={`${methodResult.current_altitude?.toFixed(2)}°`} isPrimary />
                  <Stat label="Elongasi Toposentris" value={`${methodResult.current_elongation?.toFixed(2)}°`} />
                  {methodResult.current_elongation_geo !== undefined && (
                    <Stat label="Elongasi Geosentris" value={`${methodResult.current_elongation_geo?.toFixed(2)}°`} />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-100 dark:border-white/5 pb-2">
                  Titik Referensi (Sabang)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
                  <Stat label="Tinggi Hilal" value={`${methodResult.reference_altitude?.toFixed(2)}°`} isPrimary />
                  <Stat label="Elongasi Toposentris" value={`${methodResult.reference_elongation?.toFixed(2)}°`} />
                  {methodResult.reference_elongation_geo !== undefined && (
                    <Stat label="Elongasi Geosentris" value={`${methodResult.reference_elongation_geo?.toFixed(2)}°`} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
              <Stat label="Tinggi Hilal" value={`${methodResult.current_altitude?.toFixed(2)}°`} isPrimary />
              <Stat label="Elongasi Toposentris" value={`${methodResult.current_elongation?.toFixed(2)}°`} />
              {methodResult.current_elongation_geo !== undefined && (
                <Stat label="Elongasi Geosentris" value={`${methodResult.current_elongation_geo?.toFixed(2)}°`} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

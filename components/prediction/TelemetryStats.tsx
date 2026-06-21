import { formatCoordinates } from "@/lib/utils/maps";
import { formatDegreeDMS } from "@/lib/utils/astronomy-format";
import type { HilalPrediction, MethodKey } from "@/types/hijri";
import PredictionStat from "./PredictionStat";

interface Props {
  prediction: HilalPrediction;
  method: MethodKey;
  isLocal: boolean;
  referencePassed?: boolean;
  altDanger: boolean;
  altWarning: boolean;
  elongDanger: boolean;
  elongWarning: boolean;
  elongGeoDanger: boolean;
  elongGeoWarning: boolean;
}

export default function TelemetryStats({
  prediction, method, isLocal, referencePassed,
  altDanger, altWarning, elongDanger, elongWarning, elongGeoDanger, elongGeoWarning,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <PredictionStat
          label="Ketinggian Hilal"
          value={formatDegreeDMS(prediction.altitude)}
          isPrimary={!altDanger && !altWarning}
          isDanger={altDanger}
          isWarning={altWarning}
        />
        <PredictionStat
          label={method === "KHGT" ? "Elongasi" : "Elongasi Toposentris"}
          value={formatDegreeDMS(prediction.elongation)}
          isDanger={elongDanger}
          isWarning={elongWarning}
        />
        {prediction.elongation_geo !== undefined && method !== "KHGT" && (
          <PredictionStat
            label="Elongasi Geosentris"
            value={formatDegreeDMS(prediction.elongation_geo)}
            isDanger={elongGeoDanger}
            isWarning={elongGeoWarning}
          />
        )}
      </div>

      {prediction.altitude_apparent !== undefined && (
        <div className="mb-8">
          <PredictionStat label="Ketinggian Hilal (Apparent)" value={formatDegreeDMS(prediction.altitude_apparent)} />
        </div>
      )}

      {prediction.location && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-transparent">
          <div className="space-y-1">
            <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.3em]">
              {isLocal ? "Titik Observasi Anda" : "Titik Observasi"}
            </p>
            <p className="text-[11px] font-mono font-bold text-gray-600 dark:text-gray-400">
              {formatCoordinates(prediction.location.latitude, prediction.location.longitude)}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-lg shrink-0 border transition-all ${
            prediction.is_new_month
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : method === "MABIMS" && isLocal && referencePassed
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
          }`}>
            <p className="text-[9px] font-black uppercase tracking-widest">
              {prediction.is_new_month
                ? "✓ Kriteria Terpenuhi"
                : method === "MABIMS" && isLocal && referencePassed
                  ? "⚠ Tidak Memenuhi Kriteria"
                  : "✕ Tidak Memenuhi Kriteria"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

import type { HilalPrediction } from "@/types/hijri";

interface Props {
  prediction: HilalPrediction;
  variant: "UMM_AL_QURA" | "MABIMS";
}

const VARIANT_CONFIG = {
  UMM_AL_QURA: {
    label: "Pemenuhan Parameter Umm al-Qura (Makkah)",
    colorClass: "bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/20",
    labelColor: "text-teal-600 dark:text-teal-400",
    positiveClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    negativeClass: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400",
  },
  MABIMS: {
    label: "Tambahan Pendukung Visibilitas (MABIMS)",
    colorClass: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
    labelColor: "text-amber-600 dark:text-amber-400",
    positiveClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    negativeClass: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
  },
};

export default function MoonsetParams({ prediction, variant }: Props) {
  if (!prediction.moonset_time_local || prediction.moonset_diff_minutes === undefined) return null;

  const cfg = VARIANT_CONFIG[variant];
  const isPositive = prediction.moonset_diff_minutes > 0;
  const diffMins = Math.abs(Math.round(prediction.moonset_diff_minutes));

  return (
    <div className={`flex flex-col gap-3 p-5 sm:p-6 mt-6 sm:mt-8 rounded-2xl border shadow-sm animate-in zoom-in-95 duration-500 ${cfg.colorClass}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${cfg.labelColor}`}>
        {cfg.label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col p-3 rounded-xl border bg-gray-100 dark:bg-white/5 border-transparent">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Matahari Terbenam</span>
          <span className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-300">
            {prediction.check_date_local.split(" ")[1]}
          </span>
        </div>
        <div className="flex flex-col p-3 rounded-xl border bg-gray-100 dark:bg-white/5 border-transparent">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bulan Terbenam</span>
          <span className="text-[13px] font-mono font-bold text-gray-700 dark:text-gray-300">
            {prediction.moonset_time_local.split(" ")[1]}
          </span>
        </div>
      </div>
      <div className={`mt-2 flex items-center justify-center gap-2 p-3 rounded-xl text-[11px] font-bold border transition-colors ${isPositive ? cfg.positiveClass : cfg.negativeClass}`}>
        {isPositive
          ? `${variant === "UMM_AL_QURA" ? "✓ " : ""}Bulan terbenam ${diffMins} menit setelah matahari`
          : `${variant === "UMM_AL_QURA" ? "✕ " : ""}Bulan terbenam ${diffMins} menit sebelum matahari`}
      </div>
    </div>
  );
}

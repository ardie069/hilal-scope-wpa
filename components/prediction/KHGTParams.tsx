import type { HilalPrediction } from "@/types/hijri";

interface Props {
  prediction: HilalPrediction;
}

export default function KHGTParams({ prediction }: Props) {
  if (prediction.khgt_global_valid === undefined) return null;

  return (
    <div className="flex flex-col gap-3 p-5 sm:p-6 mt-6 sm:mt-8 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 shadow-sm animate-in zoom-in-95 duration-500">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-2">
        Pemenuhan Parameter Global (KHGT)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
          prediction.khgt_global_valid
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
            : "bg-gray-100 dark:bg-white/5 border-transparent text-gray-400"
        }`}>
          <span className="text-sm">{prediction.khgt_global_valid ? "✓" : "✕"}</span>
          <span className="text-[11px] font-bold">Imkan Rukyat Global (Ketinggian &gt;= 5° &amp; Elongasi &gt;= 8°)</span>
        </div>
        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
          prediction.khgt_america_exception
            ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
            : "bg-gray-100 dark:bg-white/5 border-transparent text-gray-400"
        }`}>
          <span className="text-sm">{prediction.khgt_america_exception ? "✓" : "✕"}</span>
          <span className="text-[11px] font-bold">Pengecualian Benua Amerika (Ijtimak Sebelum Subuh di Selandia Baru)</span>
        </div>
      </div>
    </div>
  );
}

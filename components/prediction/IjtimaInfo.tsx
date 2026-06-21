import { formatSunsetCheck, formatMoonAgeHM } from "@/lib/utils/astronomy-format";
import type { HilalPrediction, MethodKey } from "@/types/hijri";

interface Props {
  prediction: HilalPrediction;
  method: MethodKey;
}

export default function IjtimaInfo({ prediction, method }: Props) {
  return (
    <>
      <section className="mb-6 sm:mb-10 relative overflow-hidden p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-linear-to-br from-primary/10 to-emerald-500/5 border border-primary/10 shadow-inner group/result">
        <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-20 transition-transform duration-3000 group-hover/result:rotate-180">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <circle cx="50" cy="50" r="45" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M50 5L50 15M50 85L50 95M5 50L15 50M85 50L95 50" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-[9px] uppercase opacity-50 font-black mb-3 tracking-[0.3em] text-primary">
            Estimasi Matahari Terbenam pada Akhir Bulan
          </p>
          <h4 className="text-base sm:text-lg md:text-xl font-black text-primary tracking-tighter mb-1">
            {formatSunsetCheck(prediction.check_date_local, prediction.timezone_name)}
          </h4>
        </div>
      </section>

      <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-white/50 dark:bg-white/3 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">Usia Bulan</p>
            <p className="text-base font-black text-gray-900 dark:text-white tabular-nums">
              {formatMoonAgeHM(prediction.age_hours)}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">Ijtimak (Konjungsi)</p>
            <p className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400">
              {new Date(prediction.ijtima_time).toLocaleString("id-ID", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
                timeZone: method === "KHGT" ? "UTC" : method === "UMM_AL_QURA" ? "Asia/Riyadh" : undefined,
                timeZoneName: "short",
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

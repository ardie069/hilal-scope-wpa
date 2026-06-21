import { getHijriMonthName } from "@/lib/utils/hijri";
import type { HilalPrediction, HijriDate, MethodKey } from "@/types/hijri";

interface Props {
  prediction: HilalPrediction;
  hijriDate: HijriDate;
  method: MethodKey;
  isLocal: boolean;
}

export default function NextMonthSummary({ prediction, hijriDate, method, isLocal }: Props) {
  const checkDate = new Date(prediction.check_date_utc);
  const daysToAdd = prediction.is_new_month ? 1 : 2;
  checkDate.setDate(checkDate.getDate() + daysToAdd);

  const nextMonthIdx = (hijriDate.month % 12) + 1;
  const nextMonthName = getHijriMonthName(nextMonthIdx);
  const nextYear = hijriDate.month === 12 ? hijriDate.year + 1 : hijriDate.year;

  const projectedGregorian = checkDate.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className={`mt-8 p-5 sm:p-6 rounded-2xl border text-center animate-in mb-2 shadow-sm ${
      isLocal
        ? "bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10"
        : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10"
    }`}>
      <p className="text-[13px] sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
        <span className={`font-black ${isLocal ? "text-amber-600 dark:text-amber-500" : "text-primary"}`}>
          1 {nextMonthName} {nextYear} H
        </span>
        {" "}kemungkinan akan dimulai pada tanggal{" "}
        <span className="font-black border-b border-gray-300 dark:border-gray-600 pb-0.5">{projectedGregorian}</span>.
        <br />
        <span className="text-[10px] sm:text-[11px] opacity-70 mt-3 block mx-auto max-w-sm">
          {method === "TABULAR"
            ? "Catatan: Metode Tabular mengambil perhitungan sesuai referensi tabular (deret aritmatika statis)."
            : method === "KHGT"
            ? "Sesuai kriteria KHGT (Turki 2016) yang divalidasi berdasarkan ketersediaan hilal di seluruh belahan bumi."
            : "Sesuai kalkulasi simulasi elongasi dan visibilitas hilal yang telah divalidasi dengan referensi kriteria metode saat ini."}
        </span>
      </p>
    </div>
  );
}

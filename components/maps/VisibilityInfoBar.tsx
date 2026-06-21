import { Info } from "lucide-react";
import type { VisibilityMapData } from "@/types/hijri";
import type { HijriMonth } from "@/hooks/use-visibility-map";
import { HIJRI_MONTHS_INDONESIA_GRAMMAR, HIJRI_MONTHS_INTERNATIONAL_GRAMMAR } from "@/lib/constants";

interface Props {
  data: VisibilityMapData | null;
  method: string;
  currentMonthEntry?: HijriMonth;
}

function formatHijriMonthIndo(intlName: string): string {
  const monthIntl = HIJRI_MONTHS_INTERNATIONAL_GRAMMAR.find((m) => m.name === intlName);
  if (!monthIntl) return intlName;
  return HIJRI_MONTHS_INDONESIA_GRAMMAR.find((m) => m.id === monthIntl.id)?.name || intlName;
}

export default function VisibilityInfoBar({ data, method, currentMonthEntry }: Props) {
  const monthLabel = data?.month_name
    ? `${formatHijriMonthIndo(data.month_name)} ${data.year} — `
    : currentMonthEntry
    ? `${formatHijriMonthIndo(currentMonthEntry.name)} — `
    : "";

  return (
    <div className="mt-8 flex flex-col md:flex-row gap-6 p-6 bg-base-300/30 rounded-3xl border border-primary/5">
      <div className="flex gap-4">
        <div className="bg-primary/20 p-3 rounded-2xl shrink-0 h-fit">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-sm uppercase tracking-wider">
            {monthLabel}Metode {method}
          </h4>
          <p className="text-xs text-base-content/60 font-medium leading-relaxed">
            {method === "ODEH" && "Membandingkan elongasi hilal dengan lebar sabit (crescent width) minimum untuk bisa terlihat (Metode Odeh 2006)."}
            {method === "KHGT" && "Kriteria Hilal Global Terpadu (Alt >= 5° dan Elong >= 8°). Menampilkan zona sebelum dan sesudah 00 UTC sesuai keputusan Kongres Turki 2016."}
          </p>
        </div>
      </div>
      <div className="md:border-l md:border-primary/10 md:pl-6 space-y-2">
        <h4 className="font-black text-sm uppercase tracking-wider">Status Data</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-success/80">NASA JPL DE440s Active</span>
        </div>
        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Real-time astronomi backend</p>
      </div>
    </div>
  );
}

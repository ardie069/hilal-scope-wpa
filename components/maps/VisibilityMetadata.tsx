import type { VisibilityMapData } from "@/types/hijri";

interface Props {
  data: VisibilityMapData;
  method: string;
}

function utcFormat(iso: string) {
  const d = new Date(iso);
  const dd = d.getUTCDate().toString().padStart(2, "0");
  const mm = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const hh = d.getUTCHours().toString().padStart(2, "0");
  const min = d.getUTCMinutes().toString().padStart(2, "0");
  return `${dd}/${mm} Pkl. ${hh}:${min} UTC`;
}

export default function VisibilityMetadata({ data, method }: Props) {
  if (!data.ijtima_time) return null;

  const ijtimaBeforeFajar =
    data.fajar_nz_time &&
    new Date(data.ijtima_time).getTime() < new Date(data.fajar_nz_time).getTime();

  return (
    <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-1001 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-end gap-1 sm:gap-2">
      <span className="text-[8px] sm:text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">
        Astronomy Metadata
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-tighter">Ijtima:</span>
        <span className="text-[9px] sm:text-[11px] font-black text-primary italic">{utcFormat(data.ijtima_time)}</span>
      </div>

      {method === "KHGT" && data.fajar_nz_time && (
        <>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-tighter">Fajar NZ:</span>
            <span className="text-[9px] sm:text-[11px] font-black text-secondary italic">{utcFormat(data.fajar_nz_time)}</span>
          </div>
          <div className="mt-0.5 pt-1 border-t border-gray-100 flex items-center gap-1.5 sm:gap-2">
            <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Terpenuhi?</span>
            <span className={`text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ${ijtimaBeforeFajar ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
              {ijtimaBeforeFajar ? "YA" : "TIDAK"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

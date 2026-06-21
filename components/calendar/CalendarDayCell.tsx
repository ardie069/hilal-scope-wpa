import { format, isSameDay } from "date-fns";
import type { MonthDayInfo } from "@/types/calendar";
import { getHijriMonthName } from "@/lib/utils/hijri";
import { getDayColor } from "@/lib/utils/calendar-colors";

const METHODS = ["TABULAR", "KHGT", "UMM_AL_QURA", "MABIMS"];

interface Props {
  day: Date;
  monthData: MonthDayInfo[];
  selectedMethod: string;
  loading: boolean;
  mode: "masehi" | "hijri";
  isMobileSpecific: boolean;
}

export default function CalendarDayCell({ day, monthData, selectedMethod, loading, mode, isMobileSpecific }: Props) {
  const dateKey = format(day, "yyyy-MM-dd");
  const dayInfo = monthData.find((d) => d.gregorian_date === dateKey);
  const isToday = isSameDay(day, new Date());
  const displayHijri = dayInfo
    ? selectedMethod === "TABULAR" ? dayInfo.tabular : dayInfo.corrections[selectedMethod]
    : null;
  const colorClass = getDayColor(day, displayHijri || undefined);

  return (
    <div
      key={dateKey}
      className={`aspect-square sm:h-32 p-1 sm:p-5 rounded-xl sm:rounded-3xl border transition-all duration-300 flex flex-col group relative overflow-hidden justify-center sm:justify-between
        ${isToday
          ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/2 hover:border-primary/30 hover:bg-white dark:hover:bg-white/5"
        }`}
    >
      <div className={`${mode === "masehi" ? "flex-1 flex items-center justify-center sm:block sm:flex-none" : "hidden sm:block"}`}>
        <span className={`font-black transition-all
          ${mode === "masehi" ? "text-xl sm:text-xs sm:opacity-40" : "text-[9px] sm:text-xs opacity-40"}
          ${isToday && !colorClass ? "text-primary !opacity-100" : colorClass ? `${colorClass} !opacity-100` : "group-hover:opacity-100"}`}>
          {format(day, "d")}
        </span>
      </div>

      {dayInfo && displayHijri ? (
        <div className={`flex-col items-center gap-0.5 sm:gap-2 mb-0.5 sm:mb-1 mt-auto sm:mt-0 ${mode === "masehi" ? "hidden sm:flex" : "flex"}`}>
          <span className={`text-base sm:text-3xl font-black tabular-nums group-hover:scale-110 transition-transform duration-500 ${colorClass || "text-gray-900 dark:text-white"}`}>
            {displayHijri.day}
          </span>
          {!(isMobileSpecific && mode === "hijri") && (
            <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity truncate w-full text-center px-0.5 ${colorClass || "text-gray-600 dark:text-gray-400"}`}>
              {getHijriMonthName(displayHijri.month, true)}
            </span>
          )}
          <div className={`flex gap-0.5 sm:gap-1 ${mode === "masehi" ? "hidden sm:flex" : "flex"}`}>
            {METHODS.map((m) => {
              if (m === selectedMethod) return null;
              const corr = m === "TABULAR" ? dayInfo.tabular : dayInfo.corrections[m];
              if (!corr || corr.day === displayHijri.day) return null;
              return (
                <div
                  key={m}
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary/40 animate-pulse"
                  title={`${m}: ${corr.day} ${corr.month_name}`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        loading && (
          <div className={`flex-col items-center gap-1 sm:gap-2 animate-pulse mt-auto sm:mt-0 ${mode === "masehi" ? "hidden sm:flex" : "flex"}`}>
            <div className="w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="w-6 h-1 sm:w-10 sm:h-2 rounded bg-gray-200 dark:bg-white/10" />
          </div>
        )
      )}

      {isToday && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      )}
    </div>
  );
}

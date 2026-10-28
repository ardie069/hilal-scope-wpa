import PrayerTimeCard from "./PrayerTimeCard";

interface PrayerTimesGridProps {
  data: any;
  loading: boolean;
  prayerNames: Record<string, string>;
}

export default function PrayerTimesGrid({ data, loading, prayerNames }: PrayerTimesGridProps) {
  if (loading && !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-8 duration-700">
      {Object.entries(data.times).map(([key, time]: [string, any], index) => {
        const isHighlight = ["fajr", "dhuhr", "asr", "maghrib", "isha"].includes(key);
        return (
          <PrayerTimeCard
            key={key}
            name={prayerNames[key] || key}
            time={time}
            isHighlight={isHighlight}
            index={index}
          />
        );
      })}
    </div>
  );
}

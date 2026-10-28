interface PrayerTimeCardProps {
  name: string;
  time: string;
  isHighlight: boolean;
  index: number;
}

export default function PrayerTimeCard({ name, time, isHighlight, index }: PrayerTimeCardProps) {
  return (
    <div
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
        isHighlight
          ? "bg-white/50 dark:bg-card-dark/50 border-gray-100 dark:border-white/10 hover:border-primary/50"
          : "bg-gray-50/50 dark:bg-white/5 border-transparent opacity-80"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
        {name}
      </p>
      <p
        className={`text-3xl font-black tabular-nums tracking-tighter ${
          isHighlight
            ? "text-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {time}
      </p>
    </div>
  );
}

export default function HijriDateBadge({ hijriDate }: { hijriDate: string }) {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="group flex items-center gap-4 px-6 py-3 bg-white/40 dark:bg-card-dark/40 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/5 shadow-soft hover:shadow-primary/10 transition-all duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <p className="text-[10px] font-black dark:text-primary-content text-base-content/60 uppercase tracking-[0.25em]">
            Tanggal Hijriyah
          </p>
          <div className="hidden sm:block h-3 w-px bg-base-content/10"></div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {hijriDate}
          </p>
        </div>
      </div>
    </div>
  );
}

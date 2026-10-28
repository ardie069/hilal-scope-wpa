export default function PrayerTimesHeader() {
  return (
    <header className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md">
          🕌
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors duration-500">
          Jadwal Sholat
        </h1>
      </div>
      <p className="text-sm sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl font-medium">
        Akurasi waktu sholat berdasarkan astronomi presisi dengan berbagai metode kalkulasi.
      </p>
    </header>
  );
}

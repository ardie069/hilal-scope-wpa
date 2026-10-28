export default function PrayerError({ error }: { error: string }) {
  return (
    <div className="bg-error/10 border border-error/20 rounded-3xl p-6 flex items-start gap-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-error text-error-content rounded-xl p-2 shrink-0 shadow-lg shadow-error/20">
        <span className="text-xl font-bold">⚠️</span>
      </div>
      <div>
        <h3 className="font-black text-error">Gagal Memuat Jadwal</h3>
        <p className="text-error/80 text-sm mt-1 leading-relaxed font-medium">
          {error}
        </p>
      </div>
    </div>
  );
}

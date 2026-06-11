import HijriCalendarGrid from "@/components/calendar/HijriCalendarGrid";

export const metadata = {
  title: "Kalender Hijriyah Robust - Hilal Scope",
  description: "Eksplorasi Kalender Hijriyah presisi tinggi dengan koreksi KHGT, MABIMS, dan Umm Al Qura.",
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background-light dark:bg-background-dark font-sans selection:bg-primary/30 selection:text-primary transition-colors duration-500">
      
      <main className="relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-primary/10 blur-[120px] -z-10 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-secondary/5 blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center sm:text-left animate-in slide-in-from-bottom duration-700">
            <h1 className="text-4xl sm:text-6xl font-black dark:text-white leading-[1.1]">
              Kalender <span className="text-primary">Hijriyah</span>
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
              Tampilan grid bulanan yang menyinkronkan metode Tabular dengan kriteria 
              astronomi modern untuk akurasi penjadwalan ibadah Anda.
            </p>
          </div>

          <HijriCalendarGrid />
          
          <section className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 opacity-80 hover:opacity-100 transition-opacity duration-500">
            <div className="p-8 rounded-[2rem] bg-gray-100/50 dark:bg-white/5 border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Metode KHGT</h3>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-loose">
                Kriteria Kalender Hijriyah Global Tunggal berbasis penampakan hilal di mana pun di permukaan bumi.
              </p>
            </div>
             <div className="p-8 rounded-[2rem] bg-gray-100/50 dark:bg-white/5 border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">MABIMS</h3>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-loose">
                Kriteria Menteri-Menteri Agama Brunei, Indonesia, Malaysia, dan Singapura (Ketinggian 3°, Elongasi 6.4°).
              </p>
            </div>
             <div className="p-8 rounded-[2rem] bg-gray-100/50 dark:bg-white/5 border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Umm Al Qura</h3>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-loose">
                Kalender resmi Arab Saudi berdasarkan ijtima sebelum tenggelamnya matahari di Mekkah.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

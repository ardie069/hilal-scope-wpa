"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-12 border-t border-gray-100 dark:border-gray-800 bg-white/30 dark:bg-background-dark/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Section 1: Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
                Hilal <span className="text-primary">Scope</span>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">
                Presisi Astronomi
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              © {currentYear} • Hilal Scope
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

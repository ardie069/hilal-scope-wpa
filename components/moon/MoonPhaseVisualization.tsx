"use client";

interface MoonPhaseVisualizationProps {
  illumination: number;
  phaseName: string;
  lat: number;
}

export default function MoonPhaseVisualization({
  illumination = 0,
  phaseName = "Loading...",
  lat = 0,
}: MoonPhaseVisualizationProps) {
  const isWaning =
    phaseName.toLowerCase().includes("waning") ||
    phaseName.toLowerCase().includes("terakhir") ||
    phaseName.toLowerCase().includes("third");

  const isWaxing = !isWaning;
  const isNorth = lat > 0;
  const lightOnRight = (isNorth && isWaxing) || (!isNorth && isWaning);
  const percentage = illumination / 100;

  return (
    <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0">
      <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse"></div>

      <div className="relative w-full h-full rounded-full bg-gray-950 shadow-2xl overflow-hidden border border-white/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-900 shadow-inner"></div>

        {/* Sisi Terang */}
        <div
          className={`absolute w-1/2 h-full bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-1000
            ${lightOnRight ? "right-0" : "left-0"}`}
        ></div>

        {/* Elips Terminator */}
        <div
          className={`absolute h-[101%] rounded-full transition-all duration-1000 ease-in-out
            ${illumination < 50 ? "bg-gray-900" : "bg-gray-100"}`}
          style={{
            width: "100%",
            transform: `scaleX(${Math.abs(1 - percentage * 2)})`,
            zIndex: 10,
          }}
        ></div>

        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pollen.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-white/10 rounded-full"></div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/90 dark:bg-black/50 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span className="text-[10px] font-black uppercase tracking-widest">
          Live
        </span>
      </div>
    </div>
  );
}

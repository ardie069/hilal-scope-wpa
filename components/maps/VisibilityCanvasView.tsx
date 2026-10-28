"use client";

interface VisibilityCanvasViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  smartLabels: { x: number; y: number; text: string; color: string; rotation: number }[];
}

export default function VisibilityCanvasView({ canvasRef, wrapperRef, smartLabels }: VisibilityCanvasViewProps) {
  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none z-400 transition-opacity duration-300">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" style={{ width: "100%", height: "100%" }} />
      <div className="absolute inset-0 overflow-hidden">
        {smartLabels.map((l, idx) => (
          <div
            key={idx}
            className={`absolute text-[9px] font-black bg-white/90 px-1 uppercase tracking-tighter shadow-sm border border-white/20 rounded whitespace-nowrap transition-all duration-500 ${l.color}`}
            style={{ left: l.x, top: l.y, transform: `translate(-50%, -50%) rotate(${l.rotation}deg)` }}
          >
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

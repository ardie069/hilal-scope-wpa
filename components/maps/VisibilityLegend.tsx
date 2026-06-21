"use client";

import { getConfig } from "@/lib/maps/visibility-config";

interface Props {
  method: string;
}

export default function VisibilityLegend({ method }: Props) {
  const config = getConfig(method);
  return (
    <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-1000 bg-white/90 backdrop-blur p-2 sm:p-4 rounded-xl shadow-2xl border border-gray-200 max-w-[140px] sm:max-w-xs transition-transform hover:scale-105 duration-300">
      <h3 className="text-[8px] sm:text-[10px] font-black mb-1.5 sm:mb-3 text-gray-800 uppercase tracking-wider">
        Legenda ({method})
      </h3>
      <div className="space-y-1 sm:space-y-2">
        {Object.entries(config.labels).map(([cat, label]) => {
          const rgb = config.colors[cat as keyof typeof config.colors];
          return (
            <div key={cat} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm shadow-inner"
                style={{ backgroundColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` }}
              />
              <span className="text-[9px] font-bold text-gray-700 uppercase">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

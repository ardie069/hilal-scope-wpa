"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface VisibilityPoint {
  lat: number;
  lon: number;
  category: string;
  alt: number;
  elong: number;
  arcv: number;
  width: number;
  sunset_utc: number;
}

interface VisibilityMapProps {
  points: VisibilityPoint[];
  method: string;
  bestLocation?: { latitude: number; longitude: number };
  date: string;
}

const ODEH_CONFIG = {
  colors: {
    ODEH_A: [34, 197, 94]   as [number, number, number], // Green
    ODEH_B: [132, 204, 22]  as [number, number, number], // Lime
    ODEH_C: [59, 130, 246]  as [number, number, number], // Blue
    ODEH_D: [168, 85, 247]  as [number, number, number], // Purple
    E:      [255, 255, 255] as [number, number, number], // Transparent
    F:      [148, 163, 184] as [number, number, number], // Slate Gray
  },
  labels: {
    ODEH_A: "Mudah dilihat mata telanjang",
    ODEH_B: "Terlihat dalam kondisi sempurna",
    ODEH_C: "Alat bantu optik (Teropong)",
    ODEH_D: "Alat optik saja (Teleskop)",
    E:      "Tidak terlihat (Di atas ufuk)",
    F:      "Di bawah ufuk (Horizon)",
  }
};

const KHGT_CONFIG = {
  colors: {
    KHGT_YES: [22, 101, 52]   as [number, number, number], // Deep Green
    KHGT_NO:  [255, 255, 255] as [number, number, number], // Transparent
    F:        [148, 163, 184] as [number, number, number], // Slate Gray
  },
  labels: {
    KHGT_YES: "Kriteria Terpenuhi (Global)",
    KHGT_NO:  "Kriteria Tidak Terpenuhi",
    F:        "Di bawah ufuk (Horizon)",
  }
};

function getCategory(method: string, h: number, elongation: number): string {
  if (method === "ODEH") {
    // Standard Odeh (2006)
    // Crescent width w (arcminutes) approximated from elongation
    const w = 15.5 * (1.0 - Math.cos(elongation * Math.PI / 180.0));
    const v = elongation - (11.837 - 6.322 * w + 0.7319 * w * w - 0.1018 * w * w * w);
    if (v > 5.65) return "A";
    if (v > 2.0) return "B";
    if (v > 0.0) return "C";
    return "D";
  }

  return "F";
}

// --- Binary search helper ---
function findLowerIndex(arr: number[], val: number, descending: boolean): number {
  let lo = 0, hi = arr.length - 1;
  if (descending) {
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] > val) lo = mid + 1;
      else hi = mid - 1;
    }
    return lo; 
  } else {
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < val) lo = mid + 1;
      else hi = mid - 1;
    }
    return hi;
  }
}

// --- CANVAS OVERLAY COMPONENT ---

function VisibilityCanvasLayer({ points, method }: { points: VisibilityPoint[], method: string }) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [smartLabels, setSmartLabels] = useState<{ x: number, y: number, text: string, color: string, rotation: number }[]>([]);

  const { grid, lats, lons } = useMemo(() => {
    const data: Record<number, Record<number, VisibilityPoint>> = {};
    points.forEach(p => {
      if (!data[p.lat]) data[p.lat] = {};
      data[p.lat][p.lon] = p;
    });
    const sortedLats = Object.keys(data).map(Number).sort((a, b) => b - a); 
    const sortedLons = sortedLats.length > 0
      ? Object.keys(data[sortedLats[0]]).map(Number).sort((a, b) => a - b) 
      : [];
    return { grid: data, lats: sortedLats, lons: sortedLons };
  }, [points]);

  const render = useCallback(() => {
    if (!canvasRef.current || lats.length < 2 || lons.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
    
    // Explicitly clear to prevent ghosting between methods
    ctx.clearRect(0, 0, size.x, size.y);

    const imgData = ctx.createImageData(size.x, size.y);
    const data = imgData.data;
    const step = 2; // High precision grid

    // Track points for labels
    let altLine: any = null;
    let elongLine: any = null;
    let sunsetLine: any = null;

    for (let x = 0; x < size.x; x += step) {
      for (let y = 0; y < size.y; y += step) {
        const latLng = map.containerPointToLatLng([x, y]);
        const lat = latLng.lat;
        const lon = latLng.lng;

        if (lat > lats[0] || lat < lats[lats.length - 1]) continue;
        if (lon < lons[0] || lon > lons[lons.length - 1]) continue;

        const i = findLowerIndex(lats, lat, true);
        if (i <= 0 || i >= lats.length) continue;

        const j = findLowerIndex(lons, lon, false);
        if (j < 0 || j >= lons.length - 1) continue;

        const lat1 = lats[i - 1], lat2 = lats[i];
        const lon1 = lons[j], lon2 = lons[j + 1];

        const p11 = grid[lat1]?.[lon1], p12 = grid[lat1]?.[lon2];
        const p21 = grid[lat2]?.[lon1], p22 = grid[lat2]?.[lon2];
        if (!p11 || !p12 || !p21 || !p22) continue;

        const t = (lat - lat2) / (lat1 - lat2);
        const u = (lon - lon1) / (lon2 - lon1);

        const alt = (1 - t) * (1 - u) * p21.alt + t * (1 - u) * p11.alt + (1 - t) * u * p22.alt + t * u * p12.alt;
        const elong = (1 - t) * (1 - u) * p21.elong + t * (1 - u) * p11.elong + (1 - t) * u * p22.elong + t * u * p12.elong;
        
        const toRad = Math.PI / 12;
        const sAvg = (1 - t) * (1 - u) * Math.sin(p21.sunset_utc * toRad) + 
                     t * (1 - u) * Math.sin(p11.sunset_utc * toRad) + 
                     (1 - t) * u * Math.sin(p22.sunset_utc * toRad) + 
                     t * u * Math.sin(p12.sunset_utc * toRad);
        const cAvg = (1 - t) * (1 - u) * Math.cos(p21.sunset_utc * toRad) + 
                     t * (1 - u) * Math.cos(p11.sunset_utc * toRad) + 
                     (1 - t) * u * Math.cos(p22.sunset_utc * toRad) + 
                     t * u * Math.cos(p12.sunset_utc * toRad);
        
        let sunsetUtc = Math.atan2(sAvg, cAvg) / toRad;
        if (sunsetUtc < 0) sunsetUtc += 24;

        const config = (method === "KHGT" ? KHGT_CONFIG : ODEH_CONFIG) as any;
        let r = 0, g = 0, b = 0, a = 0;

        if (method === "KHGT") {
          // KHGT: Logic for fixed thresholds (Alt 5, Elong 8)
          const altDist = Math.abs(alt - 5.0);
          const elongDist = Math.abs(elong - 8.0);
          const sunsetDist = Math.abs(sunsetUtc);

          // Render Lines (Grid boundaries) - Decoupled for better label capture
          if (altDist < 0.12) {
             r = 239; g = 68; b = 68; a = 255;
             if (x > size.x * 0.15 && x < size.x * 0.25 && !altLine) altLine = { x, y };
          } 
          
          if (elongDist < 0.12 && a === 0) {
             r = 0; g = 0; b = 0; a = 255; 
             if (x > size.x * 0.4 && x < size.x * 0.5 && !elongLine) elongLine = { x, y };
          } 
          
          if ((sunsetDist < 0.08 || Math.abs(sunsetDist - 24) < 0.08) && a === 0) {
             r = 249; g = 115; b = 22; a = 255; 
             if (x > size.x * 0.6 && x < size.x * 0.7 && !sunsetLine) sunsetLine = { x, y };
          }

          // Shading for KHGT: Pixel-level calculation for perfect oval
          if (a === 0) { // Only if not a line
             // We use interpolated alt & elong directly to determine 'YES' or 'NO'
             if (alt >= 5.0 && elong >= 8.0) {
                const color = config.colors['KHGT_YES' as keyof typeof config.colors];
                r = color[0]; g = color[1]; b = color[2]; a = 120; // Soft green oval
             } else if (alt <= 0) {
                const color = config.colors['F' as keyof typeof config.colors];
                r = color[0]; g = color[1]; b = color[2]; a = 160; // Horizon Gray
             } else {
                // Category KHGT_NO (Above horizon, but doesn't meet 5/8)
                // Rendered transparent as per request
                a = 0;
             }
          }
        } else {
          // ODEH: Premium Smoothed Contest Rendering (Oval/Layered)
          if (alt <= 0) {
            const color = config.colors['F' as keyof typeof config.colors];
            r = color[0]; g = color[1]; b = color[2]; a = 160;
          } else {
            // Region A-E: Above Horizon
            const arcv = (1 - t) * (1 - u) * p21.arcv + t * (1 - u) * p11.arcv + (1 - t) * u * p22.arcv + t * u * p12.arcv;
            const width = (1 - t) * (1 - u) * p21.width + t * (1 - u) * p11.width + (1 - t) * u * p22.width + t * u * p12.width;
            
            // Standard Odeh polynomial from legacy: V = ArcV - (7.1651 - 6.3226*w + 0.7319*w^2 - 0.1018*w^3)
            const wArcmin = width * 60.0;
            const v = arcv - (7.1651 - 6.3226 * wArcmin + 0.7319 * wArcmin * wArcmin - 0.1018 * wArcmin * wArcmin * wArcmin);

            // Determine color based on continuous 'v' value for "lapis" effect
            // Category thresholds matched to legacy/ahc/hilal.py
            if (v >= 5.65) {      // Cat A: Naked Eye
              const color = config.colors['ODEH_A' as keyof typeof config.colors];
              r = color[0]; g = color[1]; b = color[2]; a = 160;
              const boost = Math.min(20, (v - 5.65) * 5);
              g = Math.min(255, g + boost);
            } else if (v >= 2.0) { // Cat B: Perfect conditions
              const color = config.colors['ODEH_B' as keyof typeof config.colors];
              r = color[0]; g = color[1]; b = color[2]; a = 150;
            } else if (v >= -0.96) { // Cat C: Optical Aid
              const color = config.colors['ODEH_C' as keyof typeof config.colors];
              r = color[0]; g = color[1]; b = color[2]; a = 130;
            } else if (v >= -2.0) { // Cat D: Telescope only (approx limit)
              const color = config.colors['ODEH_D' as keyof typeof config.colors];
              r = color[0]; g = color[1]; b = color[2]; a = 110;
            } else {
              // Cat E: Invisible
              a = 0;
            }

            // Smoothing the edges between categories for "Oval" look
            const distToThreshold = Math.min(
               Math.abs(v - 5.65), 
               Math.abs(v - 2.0), 
               Math.abs(v + 0.96)
            );
            if (distToThreshold < 0.3 && a > 0) {
               a = a * 0.75; // Enhanced blending for perfect oval
            }
          }
        }

        if (a > 0) {
          const startX = x, startY = y;
          const endX = Math.min(x + step, size.x);
          const endY = Math.min(y + step, size.y);
          for (let dy = startY; dy < endY; dy++) {
            const rowOffset = dy * size.x;
            for (let dx = startX; dx < endX; dx++) {
              const idx = (rowOffset + dx) * 4;
              data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = a;
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Update labels
    const newLabels = [];
    if (altLine) newLabels.push({ ...altLine, text: "Tinggi Bulan 5°", color: "text-red-600", rotation: -30 });
    if (elongLine) newLabels.push({ ...elongLine, text: "Elongasi 8°", color: "text-gray-900", rotation: -30 });
    if (sunsetLine) newLabels.push({ ...sunsetLine, text: "Matahari Terbenam 00 UTC", color: "text-orange-600", rotation: -80 });
    setSmartLabels(newLabels);

  }, [map, grid, lats, lons, method]);

  useEffect(() => {
    render();
    map.on("moveend", render);
    return () => { map.off("moveend", render); };
  }, [map, render]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none z-[400]" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 pointer-events-none z-[500] overflow-hidden">
        {smartLabels.map((l, idx) => (
          <div 
            key={idx}
            className={`absolute text-[9px] font-black bg-white/90 px-1 uppercase tracking-tighter shadow-sm border border-white/20 rounded whitespace-nowrap transition-all duration-500 ${l.color}`}
            style={{ 
              left: l.x, 
              top: l.y, 
              transform: `translate(-50%, -50%) rotate(${l.rotation}deg)`,
            }}
          >
            {l.text}
          </div>
        ))}
      </div>
    </>
  );
}

// --- LEGEND ---

function Legend({ method }: { method: string }) {
  const config = method === "KHGT" ? KHGT_CONFIG : ODEH_CONFIG;
  return (
    <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-[1000] bg-white/90 backdrop-blur p-2 sm:p-4 rounded-xl shadow-2xl border border-gray-200 max-w-[140px] sm:max-w-xs transition-transform hover:scale-105 duration-300">
      <h3 className="text-[8px] sm:text-[10px] font-black mb-1.5 sm:mb-3 text-gray-800 uppercase tracking-wider text-primary">Legenda ({method})</h3>
      <div className="space-y-1 sm:space-y-2">
        {Object.entries(config.labels).map(([cat, label]) => {
           const rgb = config.colors[cat as keyof typeof config.colors];
           return (
            <div key={cat} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm shadow-inner" style={{ backgroundColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` }} />
              <span className="text-[9px] font-bold text-gray-700 uppercase">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- MAIN ---

export default function VisibilityMap({ points, method, bestLocation }: VisibilityMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-full h-[400px] sm:h-[650px] bg-gray-100 animate-pulse rounded-3xl" />;
  const config = method === "KHGT" ? KHGT_CONFIG : ODEH_CONFIG;

  return (
    <div className="relative w-full h-[400px] sm:h-[650px] rounded-none sm:rounded-[2rem] overflow-hidden sm:border-2 border-gray-200 shadow-2xl">
      <MapContainer
        center={[20, 0]} zoom={2} className="w-full h-full" style={{ background: "#aad3df" }}
        dragging={false} zoomControl={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <VisibilityCanvasLayer points={points} method={method} />
        {method === "KHGT" && bestLocation && (
           <Marker 
             position={[bestLocation.latitude, bestLocation.longitude]}
             icon={L.divIcon({
               className: 'custom-div-icon',
               html: `<div class="relative flex items-center justify-center">
                        <div class="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-green-400 opacity-75"></div>
                        <div class="relative inline-flex h-4 w-4 rounded-full bg-green-600 border-2 border-white shadow-lg"></div>
                      </div>`,
               iconSize: [20, 20],
               iconAnchor: [10, 10]
             })}
           >
             <Tooltip permanent direction="top" className="custom-tooltip">
               <div className="text-[9px] font-black text-green-700 uppercase tracking-tighter bg-white/90 px-2 py-0.5 rounded shadow-sm border border-green-200">
                 Ditemukan Di Sini
               </div>
             </Tooltip>
           </Marker>
        )}
      </MapContainer>
      <Legend method={method} />
    </div>
  );
}

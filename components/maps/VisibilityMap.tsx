"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMounted } from "@/hooks/use-mounted";
import type { VisibilityPoint } from "@/types/hijri";
import VisibilityCanvasLayer from "./VisibilityCanvasLayer";
import VisibilityLegend from "./VisibilityLegend";

interface VisibilityMapProps {
  points: VisibilityPoint[];
  method: string;
  bestLocation?: { latitude: number; longitude: number };
  date: string;
}

export default function VisibilityMap({ points, method, bestLocation }: VisibilityMapProps) {
  const mounted = useMounted();
  if (!mounted) return <div className="w-full h-[400px] sm:h-[650px] bg-gray-100 animate-pulse rounded-3xl" />;

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
              className: "custom-div-icon",
              html: `<div class="relative flex items-center justify-center">
                       <div class="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-green-400 opacity-75"></div>
                       <div class="relative inline-flex h-4 w-4 rounded-full bg-green-600 border-2 border-white shadow-lg"></div>
                     </div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
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
      <VisibilityLegend method={method} />
    </div>
  );
}

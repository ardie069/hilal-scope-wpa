"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useMap } from "react-leaflet";
import type { VisibilityPoint } from "@/types/hijri";
import { getConfig } from "@/lib/maps/visibility-config";
import { findLowerIndex, computeKHGTPixel, computeODEHPixel } from "@/lib/maps/visibility-utils";

interface Props {
  points: VisibilityPoint[];
  method: string;
}

export default function VisibilityCanvasLayer({ points, method }: Props) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [smartLabels, setSmartLabels] = useState<
    { x: number; y: number; text: string; color: string; rotation: number }[]
  >([]);

  const { grid, lats, lons } = useMemo(() => {
    const data: Record<number, Record<number, VisibilityPoint>> = {};
    points.forEach((p) => {
      if (!data[p.lat]) data[p.lat] = {};
      data[p.lat][p.lon] = p;
    });
    const sortedLats = Object.keys(data).map(Number).sort((a, b) => b - a);
    const sortedLons =
      sortedLats.length > 0
        ? Object.keys(data[sortedLats[0]]).map(Number).sort((a, b) => a - b)
        : [];
    return { grid: data, lats: sortedLats, lons: sortedLons };
  }, [points]);

  const render = useCallback(() => {
    if (!canvasRef.current || lats.length < 2 || lons.length < 2) return;
    const canvas = canvasRef.current;
    const size = map.getSize();
    const dpr = window.devicePixelRatio || 1;
    const physicalWidth = Math.floor(size.x * dpr);
    const physicalHeight = Math.floor(size.y * dpr);

    if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, physicalWidth, physicalHeight);
    const imgData = ctx.createImageData(physicalWidth, physicalHeight);
    const imgBytes = imgData.data;
    const step = Math.max(1, Math.round(2 * dpr));
    const colors = (getConfig(method) as { colors: Record<string, [number, number, number]> }).colors;

    let altLine: { x: number; y: number } | null = null;
    let elongLine: { x: number; y: number } | null = null;
    let sunsetLine: { x: number; y: number } | null = null;

    for (let px = 0; px < physicalWidth; px += step) {
      for (let py = 0; py < physicalHeight; py += step) {
        const cssX = px / dpr, cssY = py / dpr;
        const { lat, lng: lon } = map.containerPointToLatLng([cssX, cssY]);

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
        const lerp = (a: number, b: number, c: number, d: number) =>
          (1-t)*(1-u)*a + t*(1-u)*b + (1-t)*u*c + t*u*d;

        const alt   = lerp(p21.alt,  p11.alt,  p22.alt,  p12.alt);
        const elong = lerp(p21.elong, p11.elong, p22.elong, p12.elong);

        let pixel: { r: number; g: number; b: number; a: number };

        if (method === "KHGT") {
          const toRad = Math.PI / 12;
          const sAvg = lerp(Math.sin(p21.sunset_utc*toRad), Math.sin(p11.sunset_utc*toRad), Math.sin(p22.sunset_utc*toRad), Math.sin(p12.sunset_utc*toRad));
          const cAvg = lerp(Math.cos(p21.sunset_utc*toRad), Math.cos(p11.sunset_utc*toRad), Math.cos(p22.sunset_utc*toRad), Math.cos(p12.sunset_utc*toRad));
          let sunsetUtc = Math.atan2(sAvg, cAvg) / toRad;
          if (sunsetUtc < 0) sunsetUtc += 24;

          const result = computeKHGTPixel(alt, elong, sunsetUtc, colors);
          pixel = result;
          if (result.isAltBoundary    && cssX > size.x * 0.15 && cssX < size.x * 0.25 && !altLine)    altLine    = { x: cssX, y: cssY };
          if (result.isElongBoundary  && cssX > size.x * 0.4  && cssX < size.x * 0.5  && !elongLine)  elongLine  = { x: cssX, y: cssY };
          if (result.isSunsetBoundary && cssX > size.x * 0.6  && cssX < size.x * 0.7  && !sunsetLine) sunsetLine = { x: cssX, y: cssY };
        } else {
          const arcv  = lerp(p21.arcv,  p11.arcv,  p22.arcv,  p12.arcv);
          const width = lerp(p21.width, p11.width, p22.width, p12.width);
          pixel = computeODEHPixel(alt, arcv, width, colors);
        }

        if (pixel.a > 0) {
          const { r, g, b, a } = pixel;
          const endX = Math.min(px + step, physicalWidth);
          const endY = Math.min(py + step, physicalHeight);
          for (let dy = py; dy < endY; dy++) {
            for (let dx = px; dx < endX; dx++) {
              const idx = (dy * physicalWidth + dx) * 4;
              imgBytes[idx] = r; imgBytes[idx+1] = g; imgBytes[idx+2] = b; imgBytes[idx+3] = a;
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const newLabels = [];
    if (altLine)    newLabels.push({ ...altLine,    text: "Tinggi Bulan 5°",           color: "text-red-600",    rotation: -30 });
    if (elongLine)  newLabels.push({ ...elongLine,  text: "Elongasi 8°",               color: "text-gray-900",   rotation: -30 });
    if (sunsetLine) newLabels.push({ ...sunsetLine, text: "Matahari Terbenam 00 UTC",   color: "text-orange-600", rotation: -80 });
    setSmartLabels(newLabels);
  }, [map, grid, lats, lons, method]);

  useEffect(() => {
    let panStartCenter = map.project(map.getCenter(), map.getZoom());
    let panStartZoom = map.getZoom();

    const handleMoveStart = () => {
      panStartCenter = map.project(map.getCenter(), map.getZoom());
      panStartZoom = map.getZoom();
    };
    const handleMove = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (map.getZoom() !== panStartZoom) { wrapper.style.opacity = "0"; return; }
      wrapper.style.opacity = "1";
      const curr = map.project(map.getCenter(), panStartZoom);
      wrapper.style.transform = `translate3d(${panStartCenter.x - curr.x}px, ${panStartCenter.y - curr.y}px, 0)`;
    };
    const handleMoveEnd = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) { wrapper.style.opacity = "1"; wrapper.style.transform = "translate3d(0px,0px,0px)"; }
      render();
    };

    setTimeout(render, 0);
    map.on("movestart", handleMoveStart);
    map.on("move", handleMove);
    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("movestart", handleMoveStart);
      map.off("move", handleMove);
      map.off("moveend", handleMoveEnd);
    };
  }, [map, render]);

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

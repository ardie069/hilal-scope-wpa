"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import Clock from "@/components/Clock";
import Method from "@/components/Method";
import HijriDate from "@/components/HijriDate";
import { useHijri } from "@/hooks/use-hijri";
import { useTheme } from "@/context/theme-context";
import { useMounted } from "@/hooks/use-mounted";
import type { MethodKey } from "@/types/hijri";
import { METHODS } from "@/lib/constants";

export default function HomeClient() {
  const { darkMode } = useTheme();
  const mounted = useMounted();
  const [selectedMethod, setSelectedMethod] =
    useState<MethodKey>("KHGT");

  const userTimezone = mounted
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC";

  const { response, methodResult, weton, loading, error } =
    useHijri(selectedMethod);

  const methodLabels: Record<MethodKey, string> = Object.fromEntries(
    METHODS.map((m) => [m.id, m.label]),
  ) as Record<MethodKey, string>;

  if (!mounted) {
    return <div className="min-h-screen bg-background-light" />;
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-12 animate-in fade-in duration-1000">
      {/* 1. Header Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md">
            {darkMode ? <Moon size={48} className="text-white" /> : <Sun size={48} className="text-gray-900" />}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white transition-colors duration-500">
            Hilal Scope
          </h1>
        </div>
        <p className="text-sm sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl font-medium">
          Aplikasi Kalender Hijriyah Digital Berbasis Astronomi.
        </p>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* KOLOM KIRI: Data Utama */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className="animate-in slide-in-from-left-8 duration-700">
            <Clock userTimezone={userTimezone} />
          </section>

          <section className="animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <HijriDate
              methodResult={methodResult}
              weton={weton}
              loading={loading}
              error={error}
              method={selectedMethod}
              gregorianDate={response?.gregorian_date}
            >
              <div className="lg:hidden mt-4">
                <SelectionUI
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  userTimezone={userTimezone}
                  methodLabels={methodLabels}
                />
              </div>
            </HijriDate>
          </section>
        </div>

        {/* KOLOM KANAN: Sidebar Kontrol (Tampil hanya di Desktop) */}
        <aside className="hidden lg:flex lg:col-span-5 flex-col gap-6 sticky top-24">
          <SelectionUI
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            userTimezone={userTimezone}
            methodLabels={methodLabels}
          />
        </aside>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
      <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </span>
      <span className="font-bold text-sm text-gray-900 dark:text-white block truncate">
        {value}
      </span>
    </div>
  );
}

function SelectionUI({
  selectedMethod,
  setSelectedMethod,
  userTimezone,
  methodLabels,
}: {
  selectedMethod: MethodKey;
  setSelectedMethod: (m: MethodKey) => void;
  userTimezone: string;
  methodLabels: Record<MethodKey, string>;
}) {
  return (
    <div className="rounded-2xl p-6 sm:p-8 shadow-card border transition-all duration-500 bg-card-light dark:bg-card-dark dark:text-white border-gray-100 dark:border-gray-800 shadow-gray-200/50 dark:shadow-emerald-500/5">
      <div className="mb-8">
        <Method value={selectedMethod} onChange={setSelectedMethod} />
      </div>

      <div className="w-full border-t border-gray-100 dark:border-gray-800 mb-8 border-dashed" />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock label="Zona Waktu" value={userTimezone} />
          <InfoBlock label="Kriteria" value={methodLabels[selectedMethod]} />
        </div>
      </div>
    </div>
  );
}

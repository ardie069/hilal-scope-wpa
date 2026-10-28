"use client";

import PrayerTimesHeader from "./PrayerTimesHeader";
import PrayerTimesGrid from "./PrayerTimesGrid";
import PrayerError from "./PrayerError";
import HijriDateBadge from "./HijriDateBadge";
import MethodSelector from "./MethodSelector";

interface PrayerTimesViewProps {
  mounted: boolean;
  method: string;
  setMethod: (method: string) => void;
  data: any;
  loading: boolean;
  error: string | null;
  methods: { id: string; name: string }[];
  prayerNames: Record<string, string>;
}

export default function PrayerTimesView({
  mounted,
  method,
  setMethod,
  data,
  loading,
  error,
  methods,
  prayerNames,
}: PrayerTimesViewProps) {
  if (!mounted) {
    return <div className="min-h-screen bg-background-light" />;
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-12 animate-in fade-in duration-1000">
      <PrayerTimesHeader />

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {error && <PrayerError error={error} />}

          <PrayerTimesGrid data={data} loading={loading} prayerNames={prayerNames} />

          {data && <HijriDateBadge hijriDate={data.date.hijri} />}
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6 w-full sticky top-24 animate-in slide-in-from-right-8 duration-700">
          <MethodSelector
            methods={methods}
            method={method}
            onChange={setMethod}
            data={data}
          />
        </aside>
      </div>
    </div>
  );
}

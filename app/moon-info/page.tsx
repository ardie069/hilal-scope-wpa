"use client";

import { useMoon } from "@/hooks/use-moon";
import MoonHeroSection from "@/components/moon/MoonHeroSection";
import MoonVisualizationCard from "@/components/moon/MoonVisualizationCard";
import MoonSidebar from "@/components/moon/MoonSidebar";
import MoonSkeleton from "@/components/moon/MoonSkeleton";

export default function MoonInfoPage() {
  const { data, loading, error, lat } = useMoon();

  if (loading) return <MoonSkeleton />;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-500 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <MoonHeroSection />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <MoonVisualizationCard
              illumination={data?.illumination ?? 0}
              phaseName={data?.phase_name ?? "Loading..."}
              age={(data?.age_hours ?? 0) / 24}
              distance={data?.distance_km ?? 0}
              elongation={data?.elongation ?? 0}
              elongationGeo={data?.elongation_geo}
              altitude={data?.altitude ?? 0}
              moonrise={data?.moonrise}
              moonset={data?.moonset}
              lat={lat ?? 0}
            />
          </div>
          <MoonSidebar
            telemetry={data ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}

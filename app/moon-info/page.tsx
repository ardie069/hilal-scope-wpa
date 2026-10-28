"use client";

import { useMoon } from "@/hooks/use-moon";
import MoonInfoView from "@/components/moon/MoonInfoView";

export default function MoonInfoPage() {
  const { data, loading, error, lat } = useMoon();
  return <MoonInfoView loading={loading} error={error} data={data} lat={lat} />;
}

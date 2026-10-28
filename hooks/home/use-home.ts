"use client";

import { useState } from "react";
import { useHijri } from "@/hooks/use-hijri";
import { useTheme } from "@/context/theme-context";
import { useMounted } from "@/hooks/use-mounted";
import type { MethodKey } from "@/types/hijri";
import { METHODS } from "@/lib/constants";

export function useHome() {
  const { darkMode } = useTheme();
  const mounted = useMounted();
  const [selectedMethod, setSelectedMethod] = useState<MethodKey>("KHGT");

  const userTimezone = mounted
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC";

  const { response, methodResult, weton, loading, error } =
    useHijri(selectedMethod);

  const methodLabels: Record<MethodKey, string> = Object.fromEntries(
    METHODS.map((m) => [m.id, m.label]),
  ) as Record<MethodKey, string>;

  return {
    darkMode,
    mounted,
    selectedMethod,
    setSelectedMethod,
    userTimezone,
    response,
    methodResult,
    weton,
    loading,
    error,
    methodLabels,
  };
}

"use client";

import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { searchHijriDate } from "@/actions/hijri-search";

interface SearchResult {
  hijri_date?: {
    day: number;
    month_name: string;
    year: number;
  };
}

export function useSearch() {
  const mounted = useMounted();
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    setError(null);
    try {
      const res = await searchHijriDate(date);
      setResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal melakukan pencarian.");
      } else {
        setError("Gagal melakukan pencarian.");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    mounted,
    date,
    setDate,
    loading,
    error,
    result,
    handleSearch,
  };
}

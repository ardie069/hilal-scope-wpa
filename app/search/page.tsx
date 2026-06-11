import type { Metadata } from "next";
import SearchClient from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Pencarian Tanggal Hijriyah | Hilal Scope",
  description: "Cari data konversi tanggal Masehi ke Hijriyah Tabular.",
};

export default function SearchPage() {
  return <SearchClient />;
}

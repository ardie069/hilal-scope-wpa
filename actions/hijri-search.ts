"use server";

import { fetchHijriSearch } from "@/lib/api/hijri";

export async function searchHijriDate(date: string) {
  if (!date) {
    throw new Error("Tanggal harus diisi.");
  }
  const res = await fetchHijriSearch(date);
  return res.data;
}

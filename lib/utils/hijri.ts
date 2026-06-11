import { HIJRI_MONTHS_INDONESIA_GRAMMAR } from "../constants";

/**
 * Mendapatkan nama bulan Hijriyah dalam Bahasa Indonesia.
 * Jika abbreviated = true, maka Rabiul Awal -> R. Awal, Jumadil Akhir -> J. Akhir.
 */
export function getHijriMonthName(monthIndex: number, abbreviated: boolean = false): string {
  const month = HIJRI_MONTHS_INDONESIA_GRAMMAR.find(m => m.id === monthIndex);
  if (!month) return "";
  
  if (abbreviated) {
    const parts = month.name.split(" ");
    if (parts.length > 1) {
      // Rabiul Awal -> R. Awal, Jumadil Akhir -> J. Akhir
      return `${parts[0].charAt(0)}. ${parts[1]}`;
    }
  }
  
  return month.name;
}

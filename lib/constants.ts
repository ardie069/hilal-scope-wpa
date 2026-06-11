import type { MethodKey } from "@/types/hijri";

export const HIJRI_MONTHS_INDONESIA_GRAMMAR = [
  { id: 1, name: "Muharam", desc: "Awal Tahun" },
  { id: 2, name: "Safar", desc: "Bulan Perjalanan" },
  { id: 3, name: "Rabiul Awal", desc: "Maulid Nabi" },
  { id: 4, name: "Rabiul Akhir", desc: "Musim Dingin" },
  { id: 5, name: "Jumadil Awal", desc: "Awal Kemarau" },
  { id: 6, name: "Jumadil Akhir", desc: "Akhir Kemarau" },
  { id: 7, name: "Rajab", desc: "Bulan Mulia" },
  { id: 8, name: "Syakban", desc: "Persiapan" },
  { id: 9, name: "Ramadan", desc: "Puasa Wajib", isSpecial: true },
  { id: 10, name: "Syawal", desc: "Idul Fitri", isSpecial: true },
  { id: 11, name: "Zulkaidah", desc: "Bulan Tenang" },
  { id: 12, name: "Zulhijah", desc: "Ibadah Haji", isSpecial: true },
];

export const HIJRI_MONTHS_INTERNATIONAL_GRAMMAR = [
  { id: 1, name: "Muharram", desc: "Start of Year" },
  { id: 2, name: "Safar", desc: "Travel Month" },
  { id: 3, name: "Rabi'ul Awwal", desc: "Birth of the Prophet" },
  { id: 4, name: "Rabi'ul Akhir", desc: "Winter Solstice" },
  { id: 5, name: "Jumadil Awwal", desc: "Start of Dry Season" },
  { id: 6, name: "Jumadil Akhirah", desc: "End of Dry Season" },
  { id: 7, name: "Rajab", desc: "Holy Month" },
  { id: 8, name: "Sha'ban", desc: "Preparation" },
  { id: 9, name: "Ramadan", desc: "Obligatory Fasting", isSpecial: true },
  { id: 10, name: "Shawwal", desc: "Eid al-Fitr", isSpecial: true },
  { id: 11, name: "Dhul-Qadah", desc: "Calmiring Month" },
  { id: 12, name: "Dhul-Hijjah", desc: "Hajj Month", isSpecial: true },
];

export type HijriMonth = (typeof HIJRI_MONTHS_INDONESIA_GRAMMAR)[number];
export type HijriMonthInternational = (typeof HIJRI_MONTHS_INTERNATIONAL_GRAMMAR)[number];

/** Backend method keys — match Go routes.go */
export const METHODS: { id: MethodKey; label: string; icon: string }[] = [
  { id: "KHGT", label: "KHGT", icon: "🌍" },
  { id: "UMM_AL_QURA", label: "Umm al-Qura", icon: "🕋" },
  { id: "MABIMS", label: "MABIMS", icon: "🔢" },
  { id: "TABULAR", label: "Tabular", icon: "📖" },
];

export interface GregorianMonth {
  id: number;
  name: string;
  desc: string;
}

export const GREGORIAN_MONTHS: GregorianMonth[] = [
  { id: 1, name: "Januari", desc: "Awal Tahun" },
  { id: 2, name: "Februari", desc: "Bulan Pendek" },
  { id: 3, name: "Maret", desc: "Awal Musim" },
  { id: 4, name: "April", desc: "Musim Semi" },
  { id: 5, name: "Mei", desc: "Bulan Buruh" },
  { id: 6, name: "Juni", desc: "Pertengahan" },
  { id: 7, name: "Juli", desc: "Bulan Kemerdekaan" },
  { id: 8, name: "Agustus", desc: "Hari Kemerdekaan" },
  { id: 9, name: "September", desc: "Awal Semester" },
  { id: 10, name: "Oktober", desc: "Bulan Kesehatan" },
  { id: 11, name: "November", desc: "Bulan Pahlawan" },
  { id: 12, name: "Desember", desc: "Akhir Tahun" },
];

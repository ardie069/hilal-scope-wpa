export const ODEH_CONFIG = {
  colors: {
    ODEH_A: [34, 197, 94]   as [number, number, number],
    ODEH_B: [132, 204, 22]  as [number, number, number],
    ODEH_C: [59, 130, 246]  as [number, number, number],
    ODEH_D: [168, 85, 247]  as [number, number, number],
    E:      [255, 255, 255] as [number, number, number],
    F:      [148, 163, 184] as [number, number, number],
  },
  labels: {
    ODEH_A: "Mudah dilihat mata telanjang",
    ODEH_B: "Terlihat dalam kondisi sempurna",
    ODEH_C: "Alat bantu optik (Teropong)",
    ODEH_D: "Alat optik saja (Teleskop)",
    E:      "Tidak terlihat (Di atas ufuk)",
    F:      "Di bawah ufuk (Horizon)",
  },
};

export const KHGT_CONFIG = {
  colors: {
    KHGT_YES: [22, 101, 52]   as [number, number, number],
    KHGT_NO:  [255, 255, 255] as [number, number, number],
    F:        [148, 163, 184] as [number, number, number],
  },
  labels: {
    KHGT_YES: "Kriteria Terpenuhi (Global)",
    KHGT_NO:  "Kriteria Tidak Terpenuhi",
    F:        "Di bawah ufuk (Horizon)",
  },
};

export type VisibilityConfig = typeof ODEH_CONFIG | typeof KHGT_CONFIG;

export function getConfig(method: string): VisibilityConfig {
  return method === "KHGT" ? KHGT_CONFIG : ODEH_CONFIG;
}

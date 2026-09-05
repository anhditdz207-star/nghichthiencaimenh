import type { Trigram, TrigramKey } from "./types";

// bits: index 0 = hào dưới cùng của quái (bottom), index 2 = hào trên cùng (top)
export const TRIGRAMS: Record<TrigramKey, Trigram> = {
  càn: { key: "càn", name: "Càn (Trời)", symbol: "☰", bits: "111" },
  khôn: { key: "khôn", name: "Khôn (Đất)", symbol: "☷", bits: "000" },
  chấn: { key: "chấn", name: "Chấn (Sấm)", symbol: "☳", bits: "100" },
  khảm: { key: "khảm", name: "Khảm (Nước)", symbol: "☵", bits: "010" },
  cấn: { key: "cấn", name: "Cấn (Núi)", symbol: "☶", bits: "001" },
  tốn: { key: "tốn", name: "Tốn (Gió)", symbol: "☴", bits: "011" },
  ly: { key: "ly", name: "Ly (Lửa)", symbol: "☲", bits: "101" },
  đoài: { key: "đoài", name: "Đoài (Đầm)", symbol: "☱", bits: "110" },
};

/** Ghép hạ quái + thượng quái thành chuỗi nhị phân 6 hào (hào 1 -> hào 6) */
export function composeBinary(lower: TrigramKey, upper: TrigramKey): string {
  return TRIGRAMS[lower].bits + TRIGRAMS[upper].bits;
}

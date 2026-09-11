import { TRIGRAMS } from "../data/trigrams";
import type { TrigramKey } from "../data/types";

// Số Tiên Thiên Bát Quái dùng riêng cho công thức Mai Hoa: Càn1 Đoài2 Ly3 Chấn4 Tốn5 Khảm6 Cấn7 Khôn8
const XIANTIAN_ORDER: TrigramKey[] = ["càn", "đoài", "ly", "chấn", "tốn", "khảm", "cấn", "khôn"];

export type NguHanhQuai = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

const TRIGRAM_NGUHANH: Record<TrigramKey, NguHanhQuai> = {
  càn: "Kim", đoài: "Kim", ly: "Hỏa", chấn: "Mộc", tốn: "Mộc", khảm: "Thủy", cấn: "Thổ", khôn: "Thổ",
};

function trigramByNumber(n: number): TrigramKey {
  const idx = ((n - 1) % 8 + 8) % 8;
  return XIANTIAN_ORDER[idx];
}

/** Giờ (0-23, dương lịch/đồng hồ) -> chỉ số Địa Chi giờ, Tý=1...Hợi=12 */
export function hourToChiIndex(hour24: number): number {
  const h = ((hour24 % 24) + 24) % 24;
  if (h === 23 || h === 0) return 1;
  return Math.floor((h - 1) / 2) + 2;
}

export const CHI_NAMES_1TO12 = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export interface MaiHoaResult {
  upperTrigram: TrigramKey;
  lowerTrigram: TrigramKey;
  mainBinary: string; // hào 1 -> hào 6
  movingLine: number; // 1-6
  changedBinary: string;
  theTrigram: TrigramKey; // Thể — tĩnh, không chứa hào động
  dungTrigram: TrigramKey; // Dụng — chứa hào động
  theNguHanh: NguHanhQuai;
  dungNguHanh: NguHanhQuai;
}

/**
 * Lập quẻ Mai Hoa Dịch Số theo thời gian.
 * Công thức (theo Thiệu Khang Tiết, đối chiếu nhiều nguồn độc lập):
 *   Thượng quái = (Năm chi + Tháng + Ngày) mod 8 (dư 0 lấy 8, số Tiên Thiên).
 *   Hạ quái = (số Thượng quái + Giờ chi) mod 8 (dư 0 lấy 8).
 *   Hào động = (số Thượng quái + số Hạ quái) mod 6 (dư 0 lấy hào 6) — dùng 2 số quái đã rút gọn,
 *   KHÔNG dùng tổng thô Năm+Tháng+Ngày+Giờ (hai cách cho kết quả khác nhau trong đa số trường hợp).
 */
export function tinhMaiHoa(
  yearChiIndex: number, // Tý=1...Hợi=12
  lunarMonth: number,
  lunarDay: number,
  hourChiIndex: number // Tý=1...Hợi=12
): MaiHoaResult {
  const sumYMD = yearChiIndex + lunarMonth + lunarDay;

  let upperNumber = sumYMD % 8;
  if (upperNumber === 0) upperNumber = 8;
  let lowerNumber = (upperNumber + hourChiIndex) % 8;
  if (lowerNumber === 0) lowerNumber = 8;
  let movingLine = (upperNumber + lowerNumber) % 6;
  if (movingLine === 0) movingLine = 6;

  const upperTrigram = trigramByNumber(upperNumber);
  const lowerTrigram = trigramByNumber(lowerNumber);
  // hào 1-3 thuộc hạ quái, hào 4-6 thuộc thượng quái
  const mainBinary = TRIGRAMS[lowerTrigram].bits + TRIGRAMS[upperTrigram].bits;

  const bitsArr = mainBinary.split("");
  const idx = movingLine - 1;
  bitsArr[idx] = bitsArr[idx] === "1" ? "0" : "1";
  const changedBinary = bitsArr.join("");

  const theTrigram = movingLine <= 3 ? upperTrigram : lowerTrigram;
  const dungTrigram = movingLine <= 3 ? lowerTrigram : upperTrigram;

  return {
    upperTrigram,
    lowerTrigram,
    mainBinary,
    movingLine,
    changedBinary,
    theTrigram,
    dungTrigram,
    theNguHanh: TRIGRAM_NGUHANH[theTrigram],
    dungNguHanh: TRIGRAM_NGUHANH[dungTrigram],
  };
}

const SINH: Record<NguHanhQuai, NguHanhQuai> = { Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc" };
const KHAC: Record<NguHanhQuai, NguHanhQuai> = { Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc" };

export type MucDo = "rat_tot" | "tot" | "xau" | "rat_xau";

export const MUC_DO_LABEL: Record<MucDo, string> = {
  rat_tot: "Rất tốt",
  tot: "Tốt",
  xau: "Xấu",
  rat_xau: "Rất xấu",
};

export interface SinhKhacResult {
  quanHe: string;
  mucDo: MucDo;
  yNghia: string;
}

/** Luận ngũ hành sinh khắc giữa Thể và Dụng — theo bảng cổ điển của Mai Hoa Dịch Số */
export function xetTheDung(the: NguHanhQuai, dung: NguHanhQuai): SinhKhacResult {
  if (the === dung) {
    return {
      quanHe: "Thể — Dụng đồng hành",
      mucDo: "tot",
      yNghia: "Hai bên đồng khí, ít xung đột và có xu hướng hỗ trợ nhau.",
    };
  }
  if (SINH[the] === dung) {
    return {
      quanHe: "Thể sinh Dụng",
      mucDo: "xau",
      yNghia: "Thể phải xuất khí để hỗ trợ Dụng — bản thân hao tổn, phải cho đi nhiều hơn để thúc đẩy sự việc.",
    };
  }
  if (SINH[dung] === the) {
    return {
      quanHe: "Dụng sinh Thể",
      mucDo: "rat_tot",
      yNghia: "Ngoại lực hoặc hoàn cảnh đang bồi bổ cho Thể — thường thuận lợi vì chủ thể nhận được sự hỗ trợ.",
    };
  }
  if (KHAC[the] === dung) {
    return {
      quanHe: "Thể khắc Dụng",
      mucDo: "tot",
      yNghia: "Thể có khả năng chế ngự Dụng — thường có lợi, nhưng vẫn có thể phải hao lực để đạt mục tiêu.",
    };
  }
  return {
    quanHe: "Dụng khắc Thể",
    mucDo: "rat_xau",
    yNghia: "Dụng gây áp lực lên Thể — thường báo hiệu trở ngại, bất lợi, sự việc đi ngược lợi ích của chủ thể.",
  };
}

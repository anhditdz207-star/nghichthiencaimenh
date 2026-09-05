// Giờ hoàng đạo theo Chi của ngày — bảng tra truyền thống (Ngọc Hạp Thông Thư),
// mỗi ngày có 6/12 giờ được xem là hoàng đạo (tốt).

const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

const KHUNG_GIO: Record<string, [string, string]> = {
  "Tý": ["23:00", "00:59"],
  "Sửu": ["01:00", "02:59"],
  "Dần": ["03:00", "04:59"],
  "Mão": ["05:00", "06:59"],
  "Thìn": ["07:00", "08:59"],
  "Tỵ": ["09:00", "10:59"],
  "Ngọ": ["11:00", "12:59"],
  "Mùi": ["13:00", "14:59"],
  "Thân": ["15:00", "16:59"],
  "Dậu": ["17:00", "18:59"],
  "Tuất": ["19:00", "20:59"],
  "Hợi": ["21:00", "22:59"],
};

// Nhóm 6 cặp ngày dùng chung một bộ giờ hoàng đạo
const NHOM_GIO_TOT: [string[], string[]][] = [
  [["Tý", "Ngọ"], ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"]],
  [["Sửu", "Mùi"], ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"]],
  [["Dần", "Thân"], ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"]],
  [["Mão", "Dậu"], ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"]],
  [["Thìn", "Tuất"], ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"]],
  [["Tỵ", "Hợi"], ["Tý", "Sửu", "Thìn", "Ngọ", "Mùi", "Tuất"]],
];

export interface GioTrongNgay {
  chi: string;
  khungGio: string;
  tot: boolean;
}

/** Trả về 12 giờ (chi) trong ngày, đánh dấu giờ nào là hoàng đạo, dựa theo Chi của ngày (vd "Giáp Tý" -> "Tý") */
export function gioHoangDao(chiNgay: string): GioTrongNgay[] {
  const nhom = NHOM_GIO_TOT.find(([ngay]) => ngay.includes(chiNgay));
  const gioTot = new Set(nhom ? nhom[1] : []);
  return CHI.map((chi) => ({
    chi,
    khungGio: `${KHUNG_GIO[chi][0]}–${KHUNG_GIO[chi][1]}`,
    tot: gioTot.has(chi),
  }));
}

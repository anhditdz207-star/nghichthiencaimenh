// Ngũ hành bản mệnh (Lục Thập Hoa Giáp — Nạp Âm) và Mệnh quái (Bát Trạch),
// dựa trên tri thức truyền thống phổ biến, tự tổng hợp lại — không sao chép nguyên văn từ một nguồn cụ thể nào.

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export type NguHanh = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

// 30 nạp âm, mỗi nạp âm ứng với 2 năm can-chi liên tiếp (chu kỳ 60 năm Lục Thập Hoa Giáp)
const NAP_AM: { name: string; element: NguHanh }[] = [
  { name: "Hải Trung Kim", element: "Kim" },
  { name: "Lư Trung Hỏa", element: "Hỏa" },
  { name: "Đại Lâm Mộc", element: "Mộc" },
  { name: "Lộ Bàng Thổ", element: "Thổ" },
  { name: "Kiếm Phong Kim", element: "Kim" },
  { name: "Sơn Đầu Hỏa", element: "Hỏa" },
  { name: "Giản Hạ Thủy", element: "Thủy" },
  { name: "Thành Đầu Thổ", element: "Thổ" },
  { name: "Bạch Lạp Kim", element: "Kim" },
  { name: "Dương Liễu Mộc", element: "Mộc" },
  { name: "Tuyền Trung Thủy", element: "Thủy" },
  { name: "Ốc Thượng Thổ", element: "Thổ" },
  { name: "Tích Lịch Hỏa", element: "Hỏa" },
  { name: "Tùng Bách Mộc", element: "Mộc" },
  { name: "Trường Lưu Thủy", element: "Thủy" },
  { name: "Sa Trung Kim", element: "Kim" },
  { name: "Sơn Hạ Hỏa", element: "Hỏa" },
  { name: "Bình Địa Mộc", element: "Mộc" },
  { name: "Bích Thượng Thổ", element: "Thổ" },
  { name: "Kim Bạch Kim", element: "Kim" },
  { name: "Phú Đăng Hỏa", element: "Hỏa" },
  { name: "Thiên Hà Thủy", element: "Thủy" },
  { name: "Đại Trạch Thổ", element: "Thổ" },
  { name: "Thoa Xuyến Kim", element: "Kim" },
  { name: "Tang Đố Mộc", element: "Mộc" },
  { name: "Đại Khê Thủy", element: "Thủy" },
  { name: "Sa Trung Thổ", element: "Thổ" },
  { name: "Thiên Thượng Hỏa", element: "Hỏa" },
  { name: "Thạch Lựu Mộc", element: "Mộc" },
  { name: "Đại Hải Thủy", element: "Thủy" },
];

export function canChiIndex(year: number): number {
  return ((year - 4) % 60 + 60) % 60; // Giáp Tý = năm có (year-4) chia hết cho 60, ví dụ 1984
}

export function canChiNam(year: number): string {
  const i = canChiIndex(year);
  return `${CAN[i % 10]} ${CHI[i % 12]}`;
}

export function napAmMenh(year: number): { name: string; element: NguHanh } {
  const i = canChiIndex(year);
  return NAP_AM[Math.floor(i / 2)];
}

const TAM_HOP_GROUPS: string[][] = [
  ["Thân", "Tý", "Thìn"],
  ["Tỵ", "Dậu", "Sửu"],
  ["Dần", "Ngọ", "Tuất"],
  ["Hợi", "Mão", "Mùi"],
];

const TU_HANH_XUNG_GROUPS: string[][] = [
  ["Dần", "Thân", "Tỵ", "Hợi"],
  ["Tý", "Ngọ", "Mão", "Dậu"],
  ["Thìn", "Tuất", "Sửu", "Mùi"],
];

const LUC_HOP_PAIRS: [string, string][] = [
  ["Tý", "Sửu"], ["Dần", "Hợi"], ["Mão", "Tuất"], ["Thìn", "Dậu"], ["Tỵ", "Thân"], ["Ngọ", "Mùi"],
];

export interface QuanHeChi {
  tamHop: string[];
  tuHanhXung: string[];
  lucHop?: string;
}

/** Tam hợp, tứ hành xung, lục hợp theo Chi của năm sinh (không tính Can) */
export function quanHeTuoi(chiNam: string): QuanHeChi {
  const tamHopGroup = TAM_HOP_GROUPS.find((g) => g.includes(chiNam)) ?? [];
  const xungGroup = TU_HANH_XUNG_GROUPS.find((g) => g.includes(chiNam)) ?? [];
  const lucHopPair = LUC_HOP_PAIRS.find((p) => p.includes(chiNam));
  return {
    tamHop: tamHopGroup.filter((c) => c !== chiNam),
    tuHanhXung: xungGroup.filter((c) => c !== chiNam),
    lucHop: lucHopPair ? lucHopPair.find((c) => c !== chiNam) : undefined,
  };
}

export type Huong = "Bắc" | "Nam" | "Đông" | "Đông Nam" | "Tây" | "Tây Bắc" | "Tây Nam" | "Đông Bắc";

const DONG_TU: Huong[] = ["Bắc", "Nam", "Đông", "Đông Nam"];
const TAY_TU: Huong[] = ["Tây", "Tây Bắc", "Tây Nam", "Đông Bắc"];

const QUAI_INFO: Record<number, { ten: string; nhom: "Đông tứ mệnh" | "Tây tứ mệnh" }> = {
  1: { ten: "Khảm", nhom: "Đông tứ mệnh" },
  2: { ten: "Khôn", nhom: "Tây tứ mệnh" },
  3: { ten: "Chấn", nhom: "Đông tứ mệnh" },
  4: { ten: "Tốn", nhom: "Đông tứ mệnh" },
  6: { ten: "Càn", nhom: "Tây tứ mệnh" },
  7: { ten: "Đoài", nhom: "Tây tứ mệnh" },
  8: { ten: "Cấn", nhom: "Tây tứ mệnh" },
  9: { ten: "Ly", nhom: "Đông tứ mệnh" },
};

function reduceDigit(n: number): number {
  while (n >= 10) {
    n = String(n).split("").reduce((s, c) => s + Number(c), 0);
  }
  return n;
}

export interface MenhQuai {
  soQuai: number;
  ten: string;
  nhom: "Đông tứ mệnh" | "Tây tứ mệnh";
  huongTot: Huong[];
  huongCanTranh: Huong[];
}

/** Tính mệnh quái theo năm sinh dương lịch (quy đổi gần đúng theo năm dương) và giới tính */
export function tinhMenhQuai(birthYear: number, gender: "nam" | "nu"): MenhQuai {
  const twoDigits = birthYear % 100;
  const tong = reduceDigit(Math.floor(twoDigits / 10) + (twoDigits % 10));
  const isAfter2000 = birthYear >= 2000;

  let so: number;
  if (gender === "nam") {
    so = isAfter2000 ? 9 - tong : 10 - tong;
    if (so <= 0) so += 9;
    if (so === 5) so = 2; // Lão Khôn thay cho Nam mệnh số 5
  } else {
    so = isAfter2000 ? tong + 6 : tong + 5;
    so = reduceDigit(so);
    if (so === 0) so = 9;
    if (so === 5) so = 8; // Cấn thay cho Nữ mệnh số 5
  }

  const info = QUAI_INFO[so] ?? QUAI_INFO[1];
  const nhom = info.nhom;
  return {
    soQuai: so,
    ten: info.ten,
    nhom,
    huongTot: nhom === "Đông tứ mệnh" ? DONG_TU : TAY_TU,
    huongCanTranh: nhom === "Đông tứ mệnh" ? TAY_TU : DONG_TU,
  };
}

export interface MauSac {
  hop: string[];
  ky: string[];
}

/** Màu hợp/kỵ theo ngũ hành tương sinh — tương khắc */
export function mauHopMenh(element: NguHanh): MauSac {
  switch (element) {
    case "Kim":
      return { hop: ["Trắng, ghi, ánh kim (bản mệnh)", "Vàng, nâu đất (Thổ sinh Kim)"], ky: ["Đỏ, hồng, tím (Hỏa khắc Kim)"] };
    case "Mộc":
      return { hop: ["Xanh lá (bản mệnh)", "Xanh dương, đen (Thủy sinh Mộc)"], ky: ["Trắng, ghi (Kim khắc Mộc)"] };
    case "Thủy":
      return { hop: ["Xanh dương, đen (bản mệnh)", "Trắng, ghi (Kim sinh Thủy)"], ky: ["Vàng, nâu đất (Thổ khắc Thủy)"] };
    case "Hỏa":
      return { hop: ["Đỏ, hồng, tím (bản mệnh)", "Xanh lá (Mộc sinh Hỏa)"], ky: ["Đen, xanh dương (Thủy khắc Hỏa)"] };
    case "Thổ":
      return { hop: ["Vàng, nâu đất (bản mệnh)", "Đỏ, hồng, tím (Hỏa sinh Thổ)"], ky: ["Xanh lá (Mộc khắc Thổ)"] };
  }
}

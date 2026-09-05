// Thập nhị trực (Kiến - Trừ - Mãn - Bình - Định - Chấp - Phá - Nguy - Thành - Thu - Khai - Bế)
// Hệ thống 12 trực lặp lại theo tháng âm lịch, dùng để xem việc nên làm / nên kiêng mỗi ngày —
// một phần thường thấy trong lịch vạn niên truyền thống.

const TRUC_NAMES = [
  "Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp",
  "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế",
];

export interface TrucInfo {
  name: string;
  nenLam: string;
  kyLam: string;
}

const TRUC_INFO: Record<string, { nenLam: string; kyLam: string }> = {
  "Kiến": { nenLam: "Khởi đầu việc mới, cầu phúc, xuất hành.", kyLam: "Động thổ, an táng." },
  "Trừ": { nenLam: "Dọn dẹp, trừ bỏ điều cũ, chữa bệnh, tế lễ.", kyLam: "Khai trương, cưới hỏi." },
  "Mãn": { nenLam: "Ăn hỏi, cầu tài, nhập trạch.", kyLam: "Kiện tụng, an táng." },
  "Bình": { nenLam: "Xây dựng, sửa chữa nhà cửa.", kyLam: "Khai trương việc lớn." },
  "Định": { nenLam: "Cưới hỏi, nhậm chức, ký kết hợp đồng.", kyLam: "Kiện tụng, tranh chấp." },
  "Chấp": { nenLam: "Xây dựng, trồng trọt, chăn nuôi.", kyLam: "Xuất hành xa, khai trương." },
  "Phá": { nenLam: "Phá dỡ, chữa bệnh.", kyLam: "Việc vui, cưới hỏi, khai trương." },
  "Nguy": { nenLam: "Việc cần thận trọng, phòng bị.", kyLam: "Khởi công lớn, đi xa, leo cao." },
  "Thành": { nenLam: "Khai trương, cưới hỏi, nhậm chức — nhiều việc lớn đều thuận.", kyLam: "Không có điều gì đặc biệt phải kiêng." },
  "Thu": { nenLam: "Thu hoạch, nhập kho, ký kết.", kyLam: "Khai trương mới." },
  "Khai": { nenLam: "Khai trương, động thổ, cưới hỏi, xuất hành.", kyLam: "Không có điều gì đặc biệt phải kiêng." },
  "Bế": { nenLam: "Đắp nền, xây tường bao, an táng.", kyLam: "Khai trương, xuất hành xa." },
};

/**
 * Tính trực của một ngày.
 * @param lunarMonth tháng âm lịch (1-12)
 * @param dayChiIdx chỉ số Chi của ngày (0=Tý...11=Hợi)
 */
export function getTruc(lunarMonth: number, dayChiIdx: number): TrucInfo {
  const kienChiIdx = ((lunarMonth + 1) % 12 + 12) % 12; // tháng 1 kiến Dần(2), tháng 11 kiến Tý(0)...
  const trucIdx = ((dayChiIdx - kienChiIdx) % 12 + 12) % 12;
  const name = TRUC_NAMES[trucIdx];
  const info = TRUC_INFO[name];
  return { name, ...info };
}

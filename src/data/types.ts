export type TrigramKey = "cấn" | "khảm" | "chấn" | "tốn" | "khôn" | "ly" | "đoài" | "càn";

export interface Trigram {
  key: TrigramKey;
  name: string; // tên đầy đủ, vd "Càn (Trời)"
  symbol: string; // ký tự unicode quái ☰ ☷ ...
  /** 3 bit, index 0 = hào dưới cùng của quái, '1' dương '0' âm */
  bits: string;
}

export interface HaoInfo {
  position: 1 | 2 | 3 | 4 | 5 | 6;
  /** Diễn giải hào từ bằng lời riêng (không sao chép bản dịch có bản quyền) */
  interpretation: string;
  nenLam?: string;
  khongNenLam?: string;
}

export interface Hexagram {
  id: number; // 1-64, thứ tự Văn Vương (Chu Dịch truyền thống)
  name: string; // tên chữ Việt hoá, vd "Càn"
  fullName: string; // tên đầy đủ gồm thượng/hạ quái, vd "Thuần Càn"
  lower: TrigramKey; // hạ quái (hào 1-3)
  upper: TrigramKey; // thượng quái (hào 4-6)
  binary: string; // 6 ký tự, hào 1 -> hào 6, tính từ lower+upper
  /** Quái từ — lời luận chung, viết lại bằng lời riêng */
  overview: string;
  /** Ý nghĩa tổng quát của quẻ */
  meaning: string;
  nenLam: string;
  khongNenLam: string;
  thoiCo: string; // thời điểm thuận / nghịch
  /** Góc nhìn tu tâm theo tinh thần Phật pháp, gắn với chủ đề của quẻ */
  tuTam: string;
  /** 6 hào từ — có thể để trống (chưa biên soạn) cho các quẻ chưa hoàn thiện nội dung */
  lines?: HaoInfo[];
}

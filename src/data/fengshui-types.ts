export type FengShuiVerdict = "tot" | "xau" | "trung_tinh";

export interface FengShuiRule {
  id: number;
  group: string;
  subject: string;
  condition: string;
  verdict: FengShuiVerdict;
  reason: string;
  remedy?: string;
  /** từ khoá tiếng Việt để tìm kiếm/khớp trong danh sách chọn */
  keywords: string[];
}

export const VERDICT_LABEL: Record<FengShuiVerdict, string> = {
  tot: "Tốt",
  xau: "Xấu",
  trung_tinh: "Trung tính",
};

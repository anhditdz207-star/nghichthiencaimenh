import { FENGSHUI_RULES } from "../data/fengshui";
import type { FengShuiRule } from "../data/fengshui-types";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu tiếng Việt để tìm kiếm dễ hơn
}

/** Tìm các quy tắc khớp với từ khoá người dùng nhập (không phân biệt hoa thường, có/không dấu) */
export function searchFengShui(query: string): FengShuiRule[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return FENGSHUI_RULES.filter((r) => {
    const haystack = normalize(
      [r.subject, r.condition, r.group, ...r.keywords].join(" ")
    );
    return haystack.includes(q);
  });
}

export function rulesByGroup(group: string): FengShuiRule[] {
  return FENGSHUI_RULES.filter((r) => r.group === group);
}

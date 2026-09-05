import { useMemo, useState } from "react";
import { FENGSHUI_GROUPS } from "../data/fengshui";
import { rulesByGroup, searchFengShui } from "../lib/fengshui-search";
import { VERDICT_LABEL } from "../data/fengshui-types";
import type { FengShuiRule, FengShuiVerdict } from "../data/fengshui-types";

const VERDICT_STYLE: Record<FengShuiVerdict, string> = {
  tot: "border-jade-500/50 text-jade-400",
  xau: "border-vermil-500/50 text-vermil-500",
  trung_tinh: "border-gold-700/50 text-gold-500",
};

export default function PhongThuyPage() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>(FENGSHUI_GROUPS[0]);
  const [photo, setPhoto] = useState<string | null>(null);

  const searchResults = useMemo(() => searchFengShui(query), [query]);
  const groupResults = useMemo(() => rulesByGroup(activeGroup), [activeGroup]);
  const showing = query.trim() ? searchResults : groupResults;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50">
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-2">Phong Thủy</h1>
      <p className="text-center text-sm text-paper-100/70 mb-6">
        Tra cứu nhanh các tình huống thường gặp trong nhà ở
      </p>

      <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-4 sm:p-5 mb-6">
        <label className="text-sm text-paper-100/70 block mb-2">Ảnh tham khảo (không tự động phân tích)</label>
        <input type="file" accept="image/*" onChange={handlePhoto} className="text-xs text-paper-100/70" />
        {photo && (
          <img src={photo} alt="Ảnh không gian tham khảo" className="mt-3 rounded-md max-h-56 object-cover w-full" />
        )}
        <p className="text-[11px] text-paper-100/40 mt-3 italic">
          Ảnh chỉ hiển thị để bạn đối chiếu bằng mắt — trang này chưa tự nhận diện vật thể trong ảnh.
          Hãy nhìn ảnh rồi tìm/chọn đúng tình huống bên dưới.
        </p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Gõ tình huống, ví dụ: cây trước cửa, gương đối giường…"
          className="w-full bg-ink-800 border border-gold-700/40 rounded-md px-4 py-2.5 text-paper-50 focus:outline-none focus:border-gold-500"
        />
      </div>

      {!query.trim() && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-5 pb-1">
          {FENGSHUI_GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors ${
                activeGroup === g
                  ? "border-gold-500 text-gold-400 bg-gold-500/10"
                  : "border-gold-700/30 text-paper-100/60"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {showing.length === 0 && (
          <p className="text-center text-sm text-paper-100/50 py-6">Không tìm thấy tình huống phù hợp.</p>
        )}
        {showing.map((r) => (
          <RuleCard key={r.id} rule={r} />
        ))}
      </div>
    </div>
  );
}

function RuleCard({ rule }: { rule: FengShuiRule }) {
  return (
    <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <p className="font-display text-base">{rule.subject}</p>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${VERDICT_STYLE[rule.verdict]}`}>
          {VERDICT_LABEL[rule.verdict]}
        </span>
      </div>
      <p className="text-xs text-paper-100/50 mb-2">{rule.condition}</p>
      <p className="text-sm text-paper-100/90">{rule.reason}</p>
      {rule.remedy && (
        <p className="text-sm text-jade-400 mt-2">
          <span className="text-paper-100/50">Hoá giải: </span>{rule.remedy}
        </p>
      )}
    </div>
  );
}

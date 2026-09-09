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

  const searchResults = useMemo(() => searchFengShui(query), [query]);
  const groupResults = useMemo(() => rulesByGroup(activeGroup), [activeGroup]);
  const showing = query.trim() ? searchResults : groupResults;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50">
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-2">Phong Thủy</h1>
      <p className="text-center text-sm text-paper-100/70 mb-6">
        Tra cứu nhanh các tình huống thường gặp trong nhà ở
      </p>

      <div className="relative mb-5">
        <svg
          viewBox="0 0 24 24"
          width="18" height="18"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/60 pointer-events-none"
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm: cây trước cửa, gương đối giường, bếp đối vệ sinh…"
          className="w-full bg-ink-800 border border-gold-700/40 rounded-full pl-11 pr-4 py-3 text-paper-50 focus:outline-none focus:border-gold-500 text-sm sm:text-base"
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

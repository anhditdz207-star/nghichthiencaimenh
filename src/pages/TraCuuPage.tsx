import { useMemo, useState } from "react";
import { HEXAGRAMS } from "../data";
import HexagramGlyph from "../components/HexagramGlyph";
import { manualHexagram } from "../lib/coin-toss";
import { interpretCast } from "../lib/interpret";

export default function TraCuuPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [manualLines, setManualLines] = useState<boolean[]>(Array(6).fill(true));
  const [mode, setMode] = useState<"list" | "manual">("list");

  const selected = useMemo(() => HEXAGRAMS.find((h) => h.id === selectedId), [selectedId]);

  const manualResult = useMemo(() => {
    if (mode !== "manual") return null;
    const cast = manualHexagram(manualLines);
    return interpretCast(cast);
  }, [mode, manualLines]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50">
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-2">Tra Cứu 64 Quẻ</h1>
      <p className="text-center text-paper-100/70 mb-8">Chọn quẻ từ danh sách, hoặc tự chọn 6 hào để xem quẻ tương ứng.</p>

      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setMode("list")}
          className={`px-4 py-1.5 rounded-full border text-sm transition-colors ${mode === "list" ? "border-gold-500 text-gold-400" : "border-gold-700/40 text-paper-100/60 hover:text-paper-100"}`}
        >
          Danh sách 64 quẻ
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-1.5 rounded-full border text-sm transition-colors ${mode === "manual" ? "border-gold-500 text-gold-400" : "border-gold-700/40 text-paper-100/60 hover:text-paper-100"}`}
        >
          Tự chọn 6 hào
        </button>
      </div>

      {mode === "list" && !selected && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {HEXAGRAMS.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedId(h.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gold-700/30 hover:border-gold-500 bg-ink-900/50 transition-colors"
            >
              <HexagramGlyph binary={h.binary} size={54} />
              <span className="text-xs text-paper-100/80">{h.id}. {h.name}</span>
            </button>
          ))}
        </div>
      )}

      {mode === "list" && selected && (
        <div>
          <button onClick={() => setSelectedId(null)} className="text-sm text-gold-500 mb-4">
            ← Quay lại danh sách
          </button>
          <HexagramDetail hexagram={selected} />
        </div>
      )}

      {mode === "manual" && (
        <div>
          <div className="flex flex-col-reverse items-center gap-3 mb-8">
            {manualLines.map((isYang, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setManualLines((prev) => prev.map((v, i) => (i === idx ? !v : v)))
                }
                className="flex items-center gap-3 group"
              >
                <span className="text-xs text-paper-100/50 w-14 text-right">Hào {idx + 1}</span>
                {isYang ? (
                  <div className="h-4 w-32 bg-paper-50 rounded-sm group-hover:bg-gold-400 transition-colors" />
                ) : (
                  <div className="flex gap-2">
                    <div className="h-4 w-14 bg-paper-50 rounded-sm group-hover:bg-gold-400 transition-colors" />
                    <div className="h-4 w-14 bg-paper-50 rounded-sm group-hover:bg-gold-400 transition-colors" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-paper-100/50 mb-8">Bấm vào từng hào để đổi âm/dương.</p>
          {manualResult && <HexagramDetail hexagram={manualResult.primary} />}
        </div>
      )}
    </div>
  );
}

function HexagramDetail({ hexagram }: { hexagram: (typeof HEXAGRAMS)[number] }) {
  return (
    <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <HexagramGlyph binary={hexagram.binary} size={140} />
        <div className="flex-1">
          <h2 className="font-display text-2xl text-gold-500">{hexagram.id}. {hexagram.fullName}</h2>
          <p className="italic text-paper-100/90 mt-2">{hexagram.overview}</p>
          <p className="mt-3">{hexagram.meaning}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <div>
              <p className="text-gold-500 text-sm mb-1">Nên làm</p>
              <p className="text-sm text-paper-100/90">{hexagram.nenLam}</p>
            </div>
            <div>
              <p className="text-vermil-500 text-sm mb-1">Không nên làm</p>
              <p className="text-sm text-paper-100/90">{hexagram.khongNenLam}</p>
            </div>
          </div>
          <p className="text-sm text-paper-100/70 border-t border-gold-700/30 pt-3 mt-4">{hexagram.thoiCo}</p>
          <p className="text-sm text-jade-400 italic border-t border-gold-700/30 pt-3 mt-3">🪷 {hexagram.tuTam}</p>
        </div>
      </div>
      {hexagram.lines && (
        <div className="mt-6 pt-4 border-t border-gold-700/20">
          <p className="text-gold-500 text-sm mb-2">Hào từ chi tiết</p>
          <ul className="space-y-2 text-sm text-paper-100/85">
            {hexagram.lines.map((l) => (
              <li key={l.position}>
                <span className="text-gold-400">Hào {l.position}:</span> {l.interpretation}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!hexagram.lines && (
        <p className="mt-6 pt-4 border-t border-gold-700/20 text-xs text-paper-100/40 italic">
          Phần luận giải chi tiết từng hào (384 hào) đang được biên soạn dần cho quẻ này.
        </p>
      )}
    </div>
  );
}

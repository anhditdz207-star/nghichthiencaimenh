import { useEffect, useState } from "react";
import { castHexagram, type CastResult } from "../lib/coin-toss";
import { interpretCast } from "../lib/interpret";
import { pushHistory, loadHistory, clearHistory, type HistoryEntry } from "../lib/history";
import { buildShareUrl, parseShareUrl } from "../lib/share";
import { getHexagramByBinary } from "../data";
import HexagramGlyph from "../components/HexagramGlyph";
import BaguaWheel from "../components/BaguaWheel";

import { playOneShot } from "../lib/sound";

const SUM_LABEL: Record<number, string> = {
  6: "Lão âm — hào động",
  7: "Thiếu dương",
  8: "Thiếu âm",
  9: "Lão dương — hào động",
};

export default function GieoQuePage() {
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<CastResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(() => parseShareUrl(window.location.search));
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 1800);
      return () => clearTimeout(t);
    }
  }, [copied]);

  async function handleCast() {
    setShared(null);
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setCasting(true);
    setResult(null);
    const q = question.trim();
    setQuestion("");
    const cast = castHexagram();
    playOneShot("./spin-cast.mp3", 0.8);
    // đợi vòng bát quái xoay xong (tĩnh tại, đúng tinh thần vô vi) rồi mới hiện quẻ
    await new Promise((res) => setTimeout(res, 6800));
    setResult(cast);
    setLastQuestion(q);
    setHistory(pushHistory({ timestamp: Date.now(), cast, question: q || undefined }));
    setCasting(false);
  }

  async function handleShare() {
    if (!result) return;
    const interp = interpretCast(result);
    const url = buildShareUrl({
      primaryBinary: interp.primary.binary,
      changedBinary: interp.changed?.binary,
      movingPositions: interp.movingPositions,
    });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Sao chép liên kết chia sẻ:", url);
    }
  }

  const interp = result ? interpretCast(result) : null;

  const sharedPrimary = shared ? getHexagramByBinary(shared.primaryBinary) : undefined;
  const sharedChanged = shared?.changedBinary ? getHexagramByBinary(shared.changedBinary) : undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50">
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-2">Gieo Quẻ</h1>
      <p className="text-center text-paper-100/70 mb-2">
        Tam đồng pháp — tung ba đồng xu, sáu lần, lập nên một quẻ.
      </p>
      <div className="text-center mb-8">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="text-xs text-paper-100/50 hover:text-gold-400 underline underline-offset-2"
        >
          {showHistory ? "Đóng lịch sử" : `Lịch sử (${history.length})`}
        </button>
      </div>

      {showHistory && (
        <div className="mb-10 bg-ink-900/60 border border-gold-700/40 rounded-lg p-4 max-h-80 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-sm text-paper-100/50 text-center py-4">Chưa có lượt gieo quẻ nào.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {history.map((h, i) => {
                  const hInterp = interpretCast(h.cast);
                  const d = new Date(h.timestamp);
                  return (
                    <li key={i} className="text-sm border-b border-gold-700/20 pb-2 last:border-0">
                      <p className="text-paper-100/40 text-xs">
                        {d.toLocaleDateString("vi-VN")} {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {h.question && <p className="text-paper-100/90 italic">"{h.question}"</p>}
                      <p className="text-gold-400">
                        {hInterp.primary.name}
                        {hInterp.changed ? ` → ${hInterp.changed.name}` : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => {
                  clearHistory();
                  setHistory([]);
                }}
                className="mt-3 text-xs text-vermil-500 hover:underline"
              >
                Xoá toàn bộ lịch sử
              </button>
            </>
          )}
        </div>
      )}

      {shared && sharedPrimary && !result && (
        <div className="mb-10">
          <p className="text-center text-xs text-paper-100/50 mb-4">Quẻ được chia sẻ với bạn</p>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center mb-6">
            <div className="text-center w-[180px]">
              <p className="text-gold-500 mb-2 font-display">Quẻ chính — {sharedPrimary.fullName}</p>
              <HexagramGlyph binary={sharedPrimary.binary} movingPositions={shared.movingPositions} size={140} />
              <p className="text-xl mt-2 font-display">{sharedPrimary.name}</p>
            </div>
            {sharedChanged && (
              <div className="text-center w-[180px]">
                <p className="text-vermil-500 mb-2 font-display">Quẻ biến — {sharedChanged.fullName}</p>
                <HexagramGlyph binary={sharedChanged.binary} size={140} />
                <p className="text-xl mt-2 font-display">{sharedChanged.name}</p>
              </div>
            )}
          </div>
          <div className="space-y-3 bg-ink-900/60 border border-gold-700/40 rounded-lg p-6">
            <p className="italic text-paper-100/90">{sharedPrimary.overview}</p>
            <p>{sharedPrimary.meaning}</p>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleCast}
              className="px-6 py-2 rounded-full border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-ink-950 transition-colors"
            >
              Tự gieo quẻ của bạn
            </button>
          </div>
        </div>
      )}

      {!shared && !result && (
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <div className="w-full max-w-sm">
            <label className="text-xs text-paper-100/50 block mb-1.5 text-center">
              Điều bạn muốn hỏi (tự niệm trong lòng, ví dụ: "hôm nay đi chơi có ổn không")
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Việc muốn hỏi (không bắt buộc)…"
              className="w-full bg-ink-800 border border-gold-700/40 rounded-full px-4 py-2 text-sm text-center text-paper-50 focus:outline-none focus:border-gold-500"
            />
          </div>
          <div className="w-full flex justify-center py-2">
            <BaguaWheel spinning={casting} size={240} durationMs={6500} />
          </div>
          <button
            onClick={handleCast}
            disabled={casting}
            className="px-8 py-3 rounded-full border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-ink-950 transition-colors duration-500 disabled:opacity-40 font-display tracking-wide"
          >
            {casting ? "Đang gieo…" : "Gieo quẻ"}
          </button>
        </div>
      )}

      {result && interp && lastQuestion && (
        <p className="text-center text-sm text-paper-100/60 italic mb-4">Việc hỏi: "{lastQuestion}"</p>
      )}

      {result && interp && (
        <div className="animate-[fadeIn_1s_ease]">
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center mb-8">
            <div className="text-center w-[180px]">
              <p className="text-gold-500 mb-2 font-display">Quẻ chính — {interp.primary.fullName}</p>
              <HexagramGlyph binary={interp.primary.binary} movingPositions={interp.movingPositions} size={140} />
              <p className="text-xl mt-2 font-display">{interp.primary.name}</p>
            </div>
            {interp.changed && (
              <div className="text-center w-[180px]">
                <p className="text-vermil-500 mb-2 font-display">Quẻ biến — {interp.changed.fullName}</p>
                <HexagramGlyph binary={interp.changed.binary} size={140} />
                <p className="text-xl mt-2 font-display">{interp.changed.name}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-ink-900/60 border border-gold-700/40 rounded-lg p-6">
            <p className="italic text-paper-100/90">{interp.primary.overview}</p>
            <p>{interp.primary.meaning}</p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-gold-500 text-sm mb-1">Nên làm</p>
                <p className="text-sm text-paper-100/90">{interp.primary.nenLam}</p>
              </div>
              <div>
                <p className="text-vermil-500 text-sm mb-1">Không nên làm</p>
                <p className="text-sm text-paper-100/90">{interp.primary.khongNenLam}</p>
              </div>
            </div>
            <p className="text-sm text-paper-100/70 border-t border-gold-700/30 pt-3">{interp.primary.thoiCo}</p>
            <p className="text-sm text-jade-400 italic border-t border-gold-700/30 pt-3">🪷 {interp.primary.tuTam}</p>
          </div>

          <details className="mt-6 text-sm text-paper-100/70">
            <summary className="cursor-pointer text-gold-500">Chi tiết 6 hào gieo được</summary>
            <ul className="mt-3 space-y-1">
              {result.lines.map((l) => (
                <li key={l.position}>
                  Hào {l.position}: {l.coins.join(" · ")} (tổng {l.sum}) — {SUM_LABEL[l.sum]}
                </li>
              ))}
            </ul>
          </details>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={handleCast}
              className="px-6 py-2 rounded-full border border-gold-700 text-paper-100/80 hover:border-gold-500 hover:text-gold-400 transition-colors"
            >
              Gieo lại
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-2 rounded-full border border-gold-700 text-paper-100/80 hover:border-gold-500 hover:text-gold-400 transition-colors"
            >
              {copied ? "Đã sao chép liên kết!" : "Chia sẻ liên kết"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

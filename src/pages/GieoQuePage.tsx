import { useEffect, useState } from "react";
import { castHexagram, type CastResult } from "../lib/coin-toss";
import { interpretCast } from "../lib/interpret";
import { pushHistory } from "../lib/history";
import { buildShareUrl, parseShareUrl } from "../lib/share";
import { getHexagramByBinary } from "../data";
import HexagramGlyph from "../components/HexagramGlyph";
import BaguaWheel from "../components/BaguaWheel";

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
    const cast = castHexagram();
    // đợi vòng bát quái xoay xong (tĩnh tại, đúng tinh thần vô vi) rồi mới hiện quẻ
    await new Promise((res) => setTimeout(res, 3700));
    setResult(cast);
    pushHistory({ timestamp: Date.now(), cast });
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
      <p className="text-center text-paper-100/70 mb-10">
        Tam đồng pháp — tung ba đồng xu, sáu lần, lập nên một quẻ.
      </p>

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
          <div className="w-full flex justify-center py-2">
            <BaguaWheel spinning={casting} size={240} />
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

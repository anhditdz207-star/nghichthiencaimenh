import { useMemo, useState } from "react";
import { solarToLunar, chiNamIndex1 } from "../lib/lunar";
import { tinhMaiHoa, xetTheDung, hourToChiIndex, CHI_NAMES_1TO12, MUC_DO_LABEL } from "../lib/maihoa";
import { getHexagramByBinary } from "../data";
import HexagramGlyph from "../components/HexagramGlyph";

const MUC_DO_STYLE: Record<string, string> = {
  rat_tot: "border-jade-500/60 text-jade-400",
  tot: "border-jade-700/50 text-jade-400/90",
  xau: "border-vermil-500/50 text-vermil-500",
  rat_xau: "border-vermil-600/60 text-vermil-500",
};

export default function MaiHoaPage() {
  const now = new Date();
  const [question, setQuestion] = useState("");
  const [useNow, setUseNow] = useState(true);
  const [dateStr, setDateStr] = useState(now.toISOString().slice(0, 10));
  const [hour, setHour] = useState(now.getHours());

  const effDate = useNow ? now : new Date(dateStr + "T00:00:00");
  const effHour = useNow ? now.getHours() : hour;

  const lunar = useMemo(
    () => solarToLunar(effDate.getDate(), effDate.getMonth() + 1, effDate.getFullYear()),
    [effDate]
  );
  const yearChi = useMemo(() => chiNamIndex1(lunar.year), [lunar.year]);
  const hourChi = useMemo(() => hourToChiIndex(effHour), [effHour]);

  const result = useMemo(
    () => tinhMaiHoa(yearChi, lunar.month, lunar.day, hourChi),
    [yearChi, lunar.month, lunar.day, hourChi]
  );

  const primary = getHexagramByBinary(result.mainBinary);
  const changed = getHexagramByBinary(result.changedBinary);
  const sinhKhac = xetTheDung(result.theNguHanh, result.dungNguHanh);

  return (
    <>
      <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-gold-500 text-center mb-1">Mai Hoa Dịch Số</h1>
      <p className="text-center text-xs sm:text-sm text-paper-100/70 mb-4">
        Lập quẻ theo thời điểm — năm, tháng, ngày, giờ (âm lịch).
      </p>

      <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-4 mb-6 max-w-sm mx-auto">
        <p className="italic text-gold-500/80 text-sm text-center mb-0.5">Nhất Niệm Sở Cầu</p>
        <label className="text-xs text-paper-100/50 block mb-1.5 text-center">Điều bạn muốn hỏi (tự niệm trong lòng)</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Việc muốn hỏi (không bắt buộc)…"
          className="w-full bg-ink-800 border border-gold-700/40 rounded-full px-4 py-2 text-sm text-center text-paper-50 focus:outline-none focus:border-gold-500 mb-3"
        />
        <div className="flex gap-2 mb-3 text-xs">
          <button
            onClick={() => setUseNow(true)}
            className={`px-3 py-1 rounded-full border ${useNow ? "border-gold-500 text-gold-400" : "border-gold-700/30 text-paper-100/50"}`}
          >
            Thời điểm hiện tại
          </button>
          <button
            onClick={() => setUseNow(false)}
            className={`px-3 py-1 rounded-full border ${!useNow ? "border-gold-500 text-gold-400" : "border-gold-700/30 text-paper-100/50"}`}
          >
            Chọn thời điểm khác
          </button>
        </div>
        {!useNow && (
          <div className="flex gap-2">
            <input
              type="date"
              value={dateStr}
              onChange={(e) => e.target.value && setDateStr(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="flex-1 bg-ink-800 border border-gold-700/40 rounded-md px-2 py-1.5 text-sm text-paper-50 focus:outline-none focus:border-gold-500"
            />
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="bg-ink-800 border border-gold-700/40 rounded-md px-2 py-1.5 text-sm text-paper-50 focus:outline-none focus:border-gold-500"
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
        )}
        <p className="text-xs text-paper-100/50 mt-3">
          Âm lịch: {lunar.day}/{lunar.month}{lunar.isLeapMonth ? " (nhuận)" : ""}/{lunar.year} — giờ {CHI_NAMES_1TO12[hourChi - 1]}
        </p>
      </div>

      {primary && (
        <>
          {question.trim() && (
            <p className="text-center text-sm text-paper-100/60 italic mb-3">Việc hỏi: "{question.trim()}"</p>
          )}
        <div className="flex flex-col md:flex-row gap-10 justify-center items-center mb-8">
          <div className="text-center">
            <p className="text-gold-500 mb-2 font-display">Quẻ chính — {primary.fullName}</p>
            <HexagramGlyph binary={primary.binary} movingPositions={[result.movingLine]} size={140} />
            <p className="text-xl mt-2 font-display">{primary.name}</p>
          </div>
          {changed && (
            <div className="text-center">
              <p className="text-vermil-500 mb-2 font-display">Quẻ biến — {changed.fullName}</p>
              <HexagramGlyph binary={changed.binary} size={140} />
              <p className="text-xl mt-2 font-display">{changed.name}</p>
            </div>
          )}
        </div>
        </>
      )}

      <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex flex-wrap gap-3 justify-center mb-4 text-sm">
          <span className="px-3 py-1 rounded-full border border-gold-700/40">
            Thể: <span className="text-gold-400">{result.theNguHanh}</span>
          </span>
          <span className="px-3 py-1 rounded-full border border-gold-700/40">
            Dụng: <span className="text-gold-400">{result.dungNguHanh}</span>
          </span>
          <span className={`px-3 py-1 rounded-full border ${MUC_DO_STYLE[sinhKhac.mucDo]}`}>
            {sinhKhac.quanHe} — {MUC_DO_LABEL[sinhKhac.mucDo]}
          </span>
        </div>
        <p className="text-sm text-paper-100/90 text-center">{sinhKhac.yNghia}</p>
        {primary && (
          <p className="text-sm text-paper-100/70 text-center mt-4 pt-4 border-t border-gold-700/20 italic">
            {primary.overview}
          </p>
        )}
      </div>

      <p className="text-center text-[11px] text-paper-100/40 italic mt-6">
        Mai Hoa Dịch Số luận theo thời điểm lập quẻ — mang tính tham khảo, không phải kết luận cố định.
      </p>
    </>
  );
}

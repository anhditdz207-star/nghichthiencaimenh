import { useMemo, useState } from "react";
import { solarToLunar, canChiNam, canChiThang, canChiNgay, tietKhi, jdFromDate, chiNgayIndex } from "../lib/lunar";
import { getTruc } from "../lib/truc";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function LichAmPage() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth - 1, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const cells: (number | null)[] = Array(startWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth, viewYear]);

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(1);
  }

  const todayLunar = solarToLunar(today.getDate(), today.getMonth() + 1, today.getFullYear());

  const selectedLunar = useMemo(() => solarToLunar(selectedDay, viewMonth, viewYear), [selectedDay, viewMonth, viewYear]);
  const selectedJd = useMemo(() => jdFromDate(selectedDay, viewMonth, viewYear), [selectedDay, viewMonth, viewYear]);
  const selectedCanChiNgay = useMemo(() => canChiNgay(selectedJd), [selectedJd]);
  const selectedTruc = useMemo(
    () => getTruc(selectedLunar.month, chiNgayIndex(selectedJd)),
    [selectedLunar, selectedJd]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50">
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-2">Lịch Âm</h1>
      <p className="text-center text-paper-100/70 mb-8">
        Hôm nay: {today.getDate()}/{today.getMonth() + 1}/{today.getFullYear()} — {todayLunar.day}/{todayLunar.month}
        {todayLunar.isLeapMonth ? " (nhuận)" : ""} âm lịch, năm {canChiNam(todayLunar.year)}
        , ngày {canChiNgay(jdFromDate(today.getDate(), today.getMonth() + 1, today.getFullYear()))}
        , tiết {tietKhi(today.getDate(), today.getMonth() + 1, today.getFullYear())}
      </p>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => changeMonth(-1)} className="text-gold-500 px-2">←</button>
        <span className="font-display text-lg">Tháng {viewMonth} / {viewYear}</span>
        <button onClick={() => changeMonth(1)} className="text-gold-500 px-2">→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-paper-100/50 mb-1">
        {WEEKDAYS.map((w) => <div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, idx) => {
          if (d === null) return <div key={idx} />;
          const lunar = solarToLunar(d, viewMonth, viewYear);
          const isToday = d === today.getDate() && viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear();
          const isSelected = d === selectedDay;
          const isMung1 = lunar.day === 1;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(d)}
              className={`rounded-md p-1.5 text-center border transition-colors ${
                isSelected ? "border-gold-500 bg-gold-500/15" : isToday ? "border-gold-500/50" : "border-gold-700/20 hover:border-gold-700/50"
              }`}
            >
              <div className={`text-sm ${isSelected || isToday ? "text-gold-400" : "text-paper-50"}`}>{d}</div>
              <div className={`text-[10px] ${isMung1 ? "text-vermil-500" : "text-paper-100/50"}`}>
                {lunar.day}{isMung1 ? `/${lunar.month}` : ""}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-ink-900/60 border border-gold-700/40 rounded-lg p-5">
        <p className="font-display text-lg text-gold-500 mb-1">
          Ngày {selectedDay}/{viewMonth}/{viewYear}
        </p>
        <p className="text-sm text-paper-100/70 mb-3">
          Âm lịch: {selectedLunar.day}/{selectedLunar.month}{selectedLunar.isLeapMonth ? " (nhuận)" : ""}/{selectedLunar.year}
          {" · "}Ngày {selectedCanChiNgay}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full border border-gold-500/50 text-gold-400">
            Trực {selectedTruc.name}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-jade-400 text-sm mb-1">Nên làm</p>
            <p className="text-sm text-paper-100/90">{selectedTruc.nenLam}</p>
          </div>
          <div>
            <p className="text-vermil-500 text-sm mb-1">Không nên làm</p>
            <p className="text-sm text-paper-100/90">{selectedTruc.kyLam}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-paper-100/70 space-y-1 border-t border-gold-700/20 pt-4">
        <p>Can Chi năm (ngày đã chọn): {canChiNam(selectedLunar.year)}</p>
        <p>Can Chi tháng (ngày đã chọn): {canChiThang(selectedLunar.month, selectedLunar.year)}</p>
        <p className="text-xs text-paper-100/40 italic pt-2">
          Chuyển đổi theo thuật toán thiên văn (múi giờ UTC+7). Ô đỏ đánh dấu mùng 1 âm lịch. Bấm vào một ngày để xem chi tiết.
        </p>
      </div>
    </div>
  );
}

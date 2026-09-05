import { useMemo, useState } from "react";
import { canChiNam, napAmMenh, tinhMenhQuai, mauHopMenh, quanHeTuoi } from "../lib/destiny";
import { gioHoangDao } from "../lib/hourly";
import { solarToLunar, canChiNgay, jdFromDate } from "../lib/lunar";
import LotusSymbol from "../components/LotusSymbol";

export default function BanMenhPage() {
  const today = new Date();
  const [birthDateStr, setBirthDateStr] = useState("1995-06-15");
  const [gender, setGender] = useState<"nam" | "nu">("nam");

  const { day, month, year } = useMemo(() => {
    const [y, m, d] = birthDateStr.split("-").map(Number);
    if (!y || !m || !d) return { day: 15, month: 6, year: 1995 };
    return { day: d, month: m, year: y };
  }, [birthDateStr]);

  const napAm = useMemo(() => napAmMenh(year), [year]);
  const mau = useMemo(() => mauHopMenh(napAm.element), [napAm]);
  const menhQuai = useMemo(() => tinhMenhQuai(year, gender), [year, gender]);
  const chiNam = useMemo(() => canChiNam(year).split(" ")[1], [year]);
  const quanHe = useMemo(() => quanHeTuoi(chiNam), [chiNam]);

  const birthLunar = useMemo(() => {
    try {
      return solarToLunar(day, month, year);
    } catch {
      return null;
    }
  }, [day, month, year]);
  const birthJd = useMemo(() => jdFromDate(day, month, year), [day, month, year]);
  const birthCanChiNgay = useMemo(() => canChiNgay(birthJd), [birthJd]);

  const todayLunar = solarToLunar(today.getDate(), today.getMonth() + 1, today.getFullYear());
  const todayChiNgay = canChiNgay(jdFromDate(today.getDate(), today.getMonth() + 1, today.getFullYear())).split(" ")[1];
  const gioTot = useMemo(() => gioHoangDao(todayChiNgay), [todayChiNgay]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50">
      <div className="flex justify-center mb-2">
        <LotusSymbol size={40} />
      </div>
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-2">Bản Mệnh</h1>
      <p className="text-center text-sm text-paper-100/70 mb-8">Ngũ hành, mệnh quái, tuổi hợp - khắc và giờ tốt trong ngày</p>

      <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-5 mb-8">
        <label className="text-sm text-paper-100/70 block mb-4">
          Ngày sinh (dương lịch)
          <input
            type="date"
            value={birthDateStr}
            min="1900-01-01"
            max={today.toISOString().slice(0, 10)}
            onChange={(e) => e.target.value && setBirthDateStr(e.target.value)}
            style={{ colorScheme: "dark" }}
            className="mt-1 w-full bg-ink-800 border border-gold-700/40 rounded-md px-3 py-2 text-paper-50 focus:outline-none focus:border-gold-500"
          />
        </label>
        <label className="text-sm text-paper-100/70 block mb-3">
          Giới tính
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "nam" | "nu")}
            className="mt-1 w-full bg-ink-800 border border-gold-700/40 rounded-md px-3 py-2 text-paper-50 focus:outline-none focus:border-gold-500"
          >
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
          </select>
        </label>
        <p className="text-xs text-paper-100/50">
          Năm can chi: {canChiNam(year)}
          {birthLunar && (
            <> {" · "}Âm lịch: {birthLunar.day}/{birthLunar.month}{birthLunar.isLeapMonth ? " (nhuận)" : ""}/{birthLunar.year}
            {" · "}Ngày {birthCanChiNgay}</>
          )}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="font-display text-lg text-gold-500 mb-3">Ngũ hành bản mệnh (Nạp Âm)</h2>
        <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-5 space-y-3">
          <p className="text-xl font-display">{napAm.name} <span className="text-jade-400 text-base">— {napAm.element}</span></p>
          <div>
            <p className="text-jade-400 text-sm mb-1">Màu hợp</p>
            <p className="text-sm text-paper-100/90">{mau.hop.join("; ")}</p>
          </div>
          <div>
            <p className="text-vermil-500 text-sm mb-1">Màu nên tránh</p>
            <p className="text-sm text-paper-100/90">{mau.ky.join("; ")}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-lg text-gold-500 mb-3">Mệnh quái (Bát Trạch)</h2>
        <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-5 space-y-3">
          <p className="text-xl font-display">{menhQuai.ten} <span className="text-jade-400 text-base">— {menhQuai.nhom}</span></p>
          <div>
            <p className="text-jade-400 text-sm mb-1">Hướng hợp</p>
            <p className="text-sm text-paper-100/90">{menhQuai.huongTot.join(", ")}</p>
          </div>
          <div>
            <p className="text-vermil-500 text-sm mb-1">Hướng nên tránh</p>
            <p className="text-sm text-paper-100/90">{menhQuai.huongCanTranh.join(", ")}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-lg text-gold-500 mb-3">Tuổi hợp — khắc (theo Chi năm sinh: {chiNam})</h2>
        <div className="bg-ink-900/60 border border-gold-700/40 rounded-lg p-5 space-y-3">
          <div>
            <p className="text-jade-400 text-sm mb-1">Tam hợp — hợp làm ăn, kết giao</p>
            <p className="text-sm text-paper-100/90">Tuổi {quanHe.tamHop.join(", ")}</p>
          </div>
          {quanHe.lucHop && (
            <div>
              <p className="text-jade-400 text-sm mb-1">Lục hợp — hợp gắn bó lâu dài</p>
              <p className="text-sm text-paper-100/90">Tuổi {quanHe.lucHop}</p>
            </div>
          )}
          <div>
            <p className="text-vermil-500 text-sm mb-1">Tứ hành xung — nên cân nhắc kỹ khi hợp tác lớn</p>
            <p className="text-sm text-paper-100/90">Tuổi {quanHe.tuHanhXung.join(", ")}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-gold-500 mb-3">
          Giờ hoàng đạo hôm nay ({todayLunar.day}/{todayLunar.month} âm — ngày {canChiNgay(jdFromDate(today.getDate(), today.getMonth() + 1, today.getFullYear()))})
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {gioTot.map((g) => (
            <div
              key={g.chi}
              className={`rounded-md p-2.5 text-center border ${
                g.tot ? "border-jade-500/60 bg-jade-500/10" : "border-gold-700/20"
              }`}
            >
              <p className={`text-sm font-display ${g.tot ? "text-jade-400" : "text-paper-100/50"}`}>{g.chi}</p>
              <p className="text-[10px] text-paper-100/40">{g.khungGio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

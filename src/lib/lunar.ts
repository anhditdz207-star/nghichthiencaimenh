// Thuật toán chuyển đổi Dương lịch <-> Âm lịch Việt Nam.
// Dựa trên thuật toán thiên văn của Hồ Ngọc Đức (Đại học Leipzig), múi giờ tham chiếu UTC+7 (Việt Nam).
// Nguồn tham khảo thuật toán gốc: https://www.informatik.uni-leipzig.de/~duc/amlich/
// Bản port TypeScript này viết lại độc lập theo đúng logic thiên văn (không sao chép mã nguồn nguyên văn).

const TZ_VN = 7; // múi giờ Việt Nam

const PI = Math.PI;

/** Đổi ngày dương lịch (giờ VN) sang số ngày Julius (JDN, tại 12:00 UTC) */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      32083;
  }
  return jd;
}

/** Đổi số ngày Julius về ngày dương lịch [dd, mm, yy] */
export function jdToDate(jd: number): [number, number, number] {
  let a: number, b: number, c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((146097 * b) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

/** Tọa độ mặt trời thực (kinh độ, độ) tại thời điểm Julian day jdn — dùng để tính tiết khí */
function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) +
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * Math.floor(L / (PI * 2));
  return L;
}

/** Thời điểm sóc (New Moon) thứ k kể từ điểm mốc (JDN, tính theo giờ UTC) */
function newMoonTime(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  const Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M) -
    0.4068 * Math.sin(Mpr * dr) +
    0.0161 * Math.sin(dr * 2 * Mpr) -
    0.0004 * Math.sin(dr * 3 * Mpr) +
    0.0104 * Math.sin(dr * 2 * F) -
    0.0051 * Math.sin(dr * (M + Mpr)) -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M)) -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr)) +
    0.001 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltaT: number;
  if (T < -11) {
    deltaT =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltaT = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltaT;
}

/** Ngày Julius (làm tròn) của lần Sóc thứ k, hiệu chỉnh theo múi giờ VN */
function getNewMoonDay(k: number, timeZone: number = TZ_VN): number {
  return Math.floor(newMoonTime(k) + 0.5 + timeZone / 24);
}

/** Tìm ngày (JD) bắt đầu tháng 11 âm lịch (chứa Đông chí) của năm dương lịch yy */
function getLunarMonth11(yy: number, timeZone: number = TZ_VN): number {
  const off = jdFromDate(31, 12, yy) - 2415021.076998695;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = Math.floor((sunLongitude(nm - timeZone / 24) / PI) * 6);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getSunLongitudeIndex(jd: number, timeZone: number = TZ_VN): number {
  return Math.floor((sunLongitude(jd - timeZone / 24) / PI) * 6);
}

/** Tìm tháng nhuận (offset tính từ tháng 11 năm trước), trả về vị trí tháng thiếu trung khí, hoặc 0 nếu không có */
function getLeapMonthOffset(a11: number, timeZone: number = TZ_VN): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitudeIndex(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitudeIndex(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  jd: number;
}

/** Chuyển ngày dương lịch (dd/mm/yyyy, giờ VN) sang ngày âm lịch */
export function solarToLunar(dd: number, mm: number, yy: number, timeZone: number = TZ_VN): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthOff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthOff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthOff) lunarLeap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth: lunarLeap, jd: dayNumber };
}

/** Chuyển ngày âm lịch sang dương lịch. leap=true nếu là tháng nhuận. */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  leap: boolean = false,
  timeZone: number = TZ_VN
): [number, number, number] {
  let a11: number, b11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && lunarMonth !== leapMonth) return [0, 0, 0];
    if (leap || off >= leapOff) off += 1;
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export function canChiNam(lunarYear: number): string {
  return `${CAN[(lunarYear + 6) % 10]} ${CHI[(lunarYear + 8) % 12]}`;
}

export function canChiThang(lunarMonth: number, lunarYear: number): string {
  const canYearIdx = (lunarYear + 6) % 10;
  const canIdx = (((canYearIdx * 2 + lunarMonth + 1) % 10) + 10) % 10;
  const chiIdx = (((lunarMonth + 1) % 12) + 12) % 12;
  return `${CAN[canIdx]} ${CHI[chiIdx]}`;
}

export function canChiNgay(jd: number): string {
  return `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}`;
}

/** Chỉ số Chi của ngày (0=Tý...11=Hợi), dùng cho các bảng tra khác (vd. thập nhị trực) */
export function chiNgayIndex(jd: number): number {
  return (((jd + 1) % 12) + 12) % 12;
}

/** Tiết khí hiện tại theo kinh độ mặt trời (24 tiết khí, mỗi tiết cách nhau 15 độ) */
const TIET_KHI = [
  "Xuân phân", "Thanh minh", "Cốc vũ", "Lập hạ", "Tiểu mãn", "Mang chủng",
  "Hạ chí", "Tiểu thử", "Đại thử", "Lập thu", "Xử thử", "Bạch lộ",
  "Thu phân", "Hàn lộ", "Sương giáng", "Lập đông", "Tiểu tuyết", "Đại tuyết",
  "Đông chí", "Tiểu hàn", "Đại hàn", "Lập xuân", "Vũ thủy", "Kinh trập",
];

export function tietKhi(dd: number, mm: number, yy: number, timeZone: number = TZ_VN): string {
  const jd = jdFromDate(dd, mm, yy);
  const sunLong = sunLongitude(jd - timeZone / 24);
  const degIdx = Math.floor(((sunLong / PI) * 180) / 15) % 24;
  return TIET_KHI[(degIdx + 24) % 24];
}

export function formatLunarDate(l: LunarDate): string {
  const thang = l.isLeapMonth ? `${l.month} (nhuận)` : `${l.month}`;
  return `${l.day}/${thang}/${l.year} (${canChiNam(l.year)})`;
}

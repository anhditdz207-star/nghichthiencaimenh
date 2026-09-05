// Tam đồng pháp — lập quẻ bằng cách gieo 3 đồng xu, 6 lần (từ hào 1 đến hào 6).
// Quy ước: Sấp (mặt chữ, âm) = 2 điểm, Ngửa (mặt hình, dương) = 3 điểm.
// Tổng 3 đồng:
//   6 (3 sấp)        -> Lão âm (hào âm động, sẽ biến thành dương)
//   7 (2 sấp 1 ngửa)  -> Thiếu dương (hào dương tĩnh)
//   8 (2 ngửa 1 sấp)  -> Thiếu âm (hào âm tĩnh)
//   9 (3 ngửa)        -> Lão dương (hào dương động, sẽ biến thành âm)

export type CoinFace = "sấp" | "ngửa";

export type LineType = 6 | 7 | 8 | 9;

export interface CastLine {
  position: number; // 1 = hào đầu (dưới cùng) ... 6 = hào trên cùng
  coins: [CoinFace, CoinFace, CoinFace];
  sum: LineType;
  /** true = hào dương (—), false = hào âm (- -) trong quẻ chính */
  isYangPrimary: boolean;
  /** true nếu là hào động (lão âm/lão dương), sẽ đổi sang hào ngược trong quẻ biến */
  isMoving: boolean;
}

export interface CastResult {
  lines: CastLine[]; // index 0 = hào 1 (dưới), index 5 = hào 6 (trên)
  primaryBinary: string; // 6 ký tự, '1' = dương, '0' = âm, từ hào 1 -> hào 6
  changedBinary: string; // quẻ biến (áp dụng hào động), rỗng nếu không có hào động
  hasMovingLines: boolean;
}

function tossCoin(rng: () => number = Math.random): CoinFace {
  return rng() < 0.5 ? "sấp" : "ngửa";
}

function coinValue(face: CoinFace): number {
  return face === "sấp" ? 2 : 3;
}

/** Gieo một hào (3 đồng xu) */
export function castLine(position: number, rng: () => number = Math.random): CastLine {
  const coins: [CoinFace, CoinFace, CoinFace] = [tossCoin(rng), tossCoin(rng), tossCoin(rng)];
  const sum = coins.reduce((s: number, c) => s + coinValue(c), 0) as LineType;
  const isYangPrimary = sum === 7 || sum === 9; // 7 thiếu dương, 9 lão dương
  const isMoving = sum === 6 || sum === 9; // lão âm hoặc lão dương
  return { position, coins, sum, isYangPrimary, isMoving };
}

/** Gieo đủ 6 hào để lập quẻ chính + quẻ biến (nếu có hào động) */
export function castHexagram(rng: () => number = Math.random): CastResult {
  const lines: CastLine[] = [];
  for (let i = 1; i <= 6; i++) lines.push(castLine(i, rng));

  const primaryBinary = lines.map((l) => (l.isYangPrimary ? "1" : "0")).join("");
  const hasMovingLines = lines.some((l) => l.isMoving);
  const changedBinary = hasMovingLines
    ? lines
        .map((l) => {
          if (!l.isMoving) return l.isYangPrimary ? "1" : "0";
          // hào động đảo ngược: lão dương(9) -> âm, lão âm(6) -> dương
          return l.isYangPrimary ? "0" : "1";
        })
        .join("")
    : "";

  return { lines, primaryBinary, changedBinary, hasMovingLines };
}

/** Tra thủ công: dựng CastResult "tĩnh" (không hào động) từ 6 hào người dùng chọn, hào 1 -> hào 6 */
export function manualHexagram(yangFlags: boolean[]): CastResult {
  if (yangFlags.length !== 6) throw new Error("Cần đúng 6 hào");
  const lines: CastLine[] = yangFlags.map((isYang, idx) => ({
    position: idx + 1,
    coins: isYang ? (["ngửa", "ngửa", "sấp"] as [CoinFace, CoinFace, CoinFace]) : (["sấp", "sấp", "ngửa"] as [CoinFace, CoinFace, CoinFace]),
    sum: (isYang ? 7 : 8) as LineType,
    isYangPrimary: isYang,
    isMoving: false,
  }));
  return {
    lines,
    primaryBinary: yangFlags.map((y) => (y ? "1" : "0")).join(""),
    changedBinary: "",
    hasMovingLines: false,
  };
}

import type { CastResult } from "./coin-toss";
import { getHexagramByBinary, type Hexagram } from "../data";

export interface Interpretation {
  primary: Hexagram;
  changed?: Hexagram;
  movingPositions: number[]; // các hào động (1-6)
}

export function interpretCast(cast: CastResult): Interpretation {
  const primary = getHexagramByBinary(cast.primaryBinary);
  if (!primary) {
    throw new Error(`Không tìm thấy quẻ với mã nhị phân ${cast.primaryBinary}`);
  }
  const movingPositions = cast.lines.filter((l) => l.isMoving).map((l) => l.position);
  const changed = cast.hasMovingLines ? getHexagramByBinary(cast.changedBinary) : undefined;
  return { primary, changed, movingPositions };
}

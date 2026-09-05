// Mã hoá/giải mã kết quả gieo quẻ vào URL để chia sẻ, không cần backend.
// Định dạng: ?q=<primaryBinary>&c=<changedBinary?>&m=<vị trí hào động, cách nhau bởi dấu phẩy>

export interface ShareState {
  primaryBinary: string;
  changedBinary?: string;
  movingPositions: number[];
}

export function buildShareUrl(state: ShareState): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("q", state.primaryBinary);
  if (state.changedBinary) url.searchParams.set("c", state.changedBinary);
  if (state.movingPositions.length) url.searchParams.set("m", state.movingPositions.join(","));
  return url.toString();
}

export function parseShareUrl(search: string): ShareState | null {
  const params = new URLSearchParams(search);
  const q = params.get("q");
  if (!q || !/^[01]{6}$/.test(q)) return null;
  const c = params.get("c");
  const m = params.get("m");
  return {
    primaryBinary: q,
    changedBinary: c && /^[01]{6}$/.test(c) ? c : undefined,
    movingPositions: m ? m.split(",").map(Number).filter((n) => n >= 1 && n <= 6) : [],
  };
}

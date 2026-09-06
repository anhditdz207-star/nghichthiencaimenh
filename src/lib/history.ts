import type { CastResult } from "./coin-toss";

export interface HistoryEntry {
  timestamp: number;
  cast: CastResult;
  question?: string;
}

const KEY = "kinhdich.history.v1";

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry, max = 50): HistoryEntry[] {
  const current = loadHistory();
  const next = [entry, ...current].slice(0, max);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // bỏ qua nếu storage đầy / bị chặn
  }
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

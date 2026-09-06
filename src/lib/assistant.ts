import { FAQ_ITEMS, FAQ_CATEGORY_LABEL, type FaqItem } from "../data/faq";
import { FENGSHUI_RULES } from "../data/fengshui";
import type { FengShuiRule } from "../data/fengshui-types";
import { VERDICT_LABEL } from "../data/fengshui-types";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

const GREETINGS = [
  "Chào bạn! Hỏi mình về Kinh Dịch, lịch âm, mệnh lý hay phong thủy nhà cửa đều được nhé. 🪷",
  "Xin chào! Mình biết kha khá chuyện Đông phương đấy, cứ hỏi thoải mái. ☯️",
];

const FALLBACKS = [
  "Câu này mình chưa có trong sổ tay rồi 😅. Bạn thử hỏi cách khác, hoặc ghé mục Phong Thủy / Tra Cứu để xem trực tiếp nhé.",
  "Hmm, mình lục hết dữ liệu mà chưa thấy gì khớp cả. Có thể diễn đạt lại ngắn gọn hơn không?",
  "Cái này nằm ngoài vốn hiểu biết của mình rồi 🪷 — mình chỉ trả lời dựa trên dữ liệu có sẵn thôi, không phải AI biết tuốt đâu nhé.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface AssistantAnswer {
  text: string;
  sourceLabel?: string;
}

interface ScoredFaq { kind: "faq"; item: FaqItem; score: number }
interface ScoredRule { kind: "rule"; item: FengShuiRule; score: number }
type Scored = ScoredFaq | ScoredRule;

function tokenize(s: string): string[] {
  return normalize(s).split(/\s+/).filter(Boolean);
}

const STOPWORDS = new Set([
  "khong", "duoc", "co", "la", "gi", "cua", "va", "hay", "the", "nay",
  "do", "mot", "nhung", "cho", "voi", "vao", "ra", "thi", "nen", "neu",
  "nhu", "sao", "vay", "day", "kia", "ai", "khi", "den", "tu", "trong",
  "ngoai", "sau", "truoc", "toi", "ban", "minh", "rat", "qua", "cung",
  "phai", "bi", "se", "da", "dang", "con", "chi", "de", "lam", "duoi",
]);

function meaningfulWords(words: string[]): string[] {
  return words.filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function scoreFaq(item: FaqItem, inputNorm: string, words: string[]): number {
  const q = normalize(item.question);
  const topic = normalize(item.topic);
  const qWords = new Set(meaningfulWords(tokenize(item.question)));
  const topicWords = new Set(meaningfulWords(tokenize(item.topic)));
  let score = 0;
  if (q === inputNorm) score += 20;
  else if (inputNorm.length >= 6 && (q.includes(inputNorm) || inputNorm.includes(q))) score += 10;
  if (topic && inputNorm.includes(topic)) score += 6;
  for (const w of words) {
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    if (qWords.has(w)) score += 2;
    if (topicWords.has(w)) score += 2;
  }
  return score;
}

function scoreRule(item: FengShuiRule, inputNorm: string, words: string[]): number {
  const subject = normalize(item.subject);
  const kws = item.keywords.map(normalize);
  const subjectWords = new Set(meaningfulWords(tokenize(item.subject)));
  const conditionWords = new Set(meaningfulWords(tokenize(item.condition)));
  let score = 0;
  if (subject === inputNorm) score += 20;
  else if (inputNorm.length >= 6 && (subject.includes(inputNorm) || inputNorm.includes(subject))) score += 9;
  for (const k of kws) {
    if (k.length >= 3 && (inputNorm.includes(k) || (k.length >= 4 && inputNorm.split(/\s+/).includes(k)))) score += 7;
  }
  for (const w of words) {
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    if (subjectWords.has(w)) score += 2;
    if (conditionWords.has(w)) score += 1;
    for (const k of kws) if (k === w) score += 2;
  }
  return score;
}

function formatFaqAnswer(item: FaqItem): string {
  return item.answer;
}

function formatRuleAnswer(item: FengShuiRule): string {
  let text = `**${item.subject}** (${item.condition}) — ${VERDICT_LABEL[item.verdict]}.\n${item.reason}`;
  if (item.remedy) text += `\nCách hoá giải: ${item.remedy}`;
  return text;
}

/** Trả lời dựa hoàn toàn trên dữ liệu có sẵn — không gọi AI, không bịa thông tin ngoài dữ liệu. */
export function askAssistant(userInput: string): AssistantAnswer {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return { text: "Bạn hỏi mình gì đi chứ, đừng ngại 😊" };
  }
  const inputNorm = normalize(trimmed);
  const words = meaningfulWords(inputNorm.split(/\s+/));

  const scored: Scored[] = [];
  for (const item of FAQ_ITEMS) {
    const score = scoreFaq(item, inputNorm, words);
    if (score > 0) scored.push({ kind: "faq", item, score });
  }
  for (const item of FENGSHUI_RULES) {
    const score = scoreRule(item, inputNorm, words);
    if (score > 0) scored.push({ kind: "rule", item, score });
  }

  if (scored.length === 0) {
    return { text: pickRandom(FALLBACKS) };
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const MIN_SCORE = 4;
  if (best.score < MIN_SCORE) {
    return { text: pickRandom(FALLBACKS) };
  }

  if (best.kind === "faq") {
    return { text: formatFaqAnswer(best.item), sourceLabel: FAQ_CATEGORY_LABEL[best.item.category] };
  }
  return { text: formatRuleAnswer(best.item), sourceLabel: `Phong Thủy — ${best.item.group}` };
}

export function randomGreeting(): string {
  return pickRandom(GREETINGS);
}

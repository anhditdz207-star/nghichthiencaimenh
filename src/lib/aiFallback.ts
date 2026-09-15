// Gọi qua Cloudflare Worker (giấu API key Gemini) — chỉ dùng khi dữ liệu có sẵn không trả lời được.
// Điền URL Worker của bạn vào đây sau khi deploy theo hướng dẫn ở /cloudflare-worker/README.md.
const WORKER_URL = "[https://tieuthachai.anhditdz207.workers.dev](https://tieuthachai.anhditdz207.workers.dev)";

export async function askAI(question: string): Promise<string | null> {
  if (!WORKER_URL) return null;
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.answer === "string" ? data.answer : null;
  } catch {
    return null;
  }
}

export function isAiConfigured(): boolean {
  return Boolean(WORKER_URL);
}

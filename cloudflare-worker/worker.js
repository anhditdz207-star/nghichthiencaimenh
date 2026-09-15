// Cloudflare Worker cho Tiểu Thạch — giấu API key Gemini, chỉ dùng khi dữ liệu có sẵn của web
// không trả lời được. Deploy theo hướng dẫn trong README.md ở thư mục này.

const SYSTEM_PROMPT = `Bạn là Tiểu Thạch, trợ lý nhỏ vui vẻ của trang web Hoán Vận
(Kinh Dịch, lịch âm, mệnh lý, phong thủy dân gian Việt Nam).
Trả lời NGẮN GỌN (tối đa 3-4 câu), bằng tiếng Việt, giọng thân thiện, tự nhiên như đang trò chuyện.
Không phân tích sâu, không dài dòng — chỉ tổng hợp thông tin cơ bản, dễ hiểu.
Nếu câu hỏi thuộc Kinh Dịch/phong thủy/tử vi mà không chắc chắn, trả lời thận trọng, khuyên người
dùng tự tra cứu thêm thay vì khẳng định chắc chắn.`;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    let question;
    try {
      const body = await request.json();
      question = body?.question;
    } catch {
      return new Response(JSON.stringify({ error: "invalid_json" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (!question || typeof question !== "string" || question.length > 500) {
      return new Response(JSON.stringify({ error: "invalid_question" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
          }),
        }
      );

      if (!geminiRes.ok) {
        return new Response(JSON.stringify({ error: "gemini_error" }), {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const data = await geminiRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        return new Response(JSON.stringify({ error: "empty_response" }), {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ answer: text }), {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "server_error" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  },
};

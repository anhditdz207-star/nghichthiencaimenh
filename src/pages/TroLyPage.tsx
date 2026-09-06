import { useEffect, useRef, useState } from "react";
import { askAssistant, randomGreeting } from "../lib/assistant";
import LotusSymbol from "../components/LotusSymbol";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  sourceLabel?: string;
}

let nextId = 1;

export default function TroLyPage() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: nextId++, role: "bot", text: randomGreeting() },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: nextId++, role: "user", text };
    const answer = askAssistant(text);
    const botMsg: Message = { id: nextId++, role: "bot", text: answer.text, sourceLabel: answer.sourceLabel };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-paper-50 flex flex-col" style={{ minHeight: "70vh" }}>
      <div className="flex justify-center mb-2">
        <LotusSymbol size={36} />
      </div>
      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold-500 text-center mb-1">Trợ Lý</h1>
      <p className="text-center text-xs text-paper-100/50 mb-6">
        Trả lời dựa trên dữ liệu có sẵn của Hoán Vận — không phải AI, không bịa thông tin ngoài dữ liệu.
      </p>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto" style={{ maxHeight: "55vh" }}>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                m.role === "user"
                  ? "bg-gold-500/20 border border-gold-500/40 text-paper-50 rounded-br-sm"
                  : "bg-ink-900/70 border border-gold-700/30 text-paper-100/90 rounded-bl-sm"
              }`}
            >
              {m.text}
              {m.sourceLabel && (
                <p className="text-[10px] text-jade-400 mt-1.5">Nguồn: {m.sourceLabel}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi về Kinh Dịch, lịch âm, mệnh lý, phong thủy…"
          className="flex-1 bg-ink-800 border border-gold-700/40 rounded-full px-4 py-2.5 text-sm text-paper-50 focus:outline-none focus:border-gold-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-ink-950 transition-colors text-sm font-display"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}

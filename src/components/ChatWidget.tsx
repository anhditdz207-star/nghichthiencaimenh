import { useEffect, useRef, useState } from "react";
import { askAssistant, randomGreeting } from "../lib/assistant";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  sourceLabel?: string;
}

let nextId = 1;
const NAME = "Tiểu Thạch";
const AVATAR = "./tieuthach-avatar.png";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: nextId++, role: "bot", text: randomGreeting() },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

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
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] max-w-sm h-[65vh] max-h-[520px] bg-ink-950 border-2 border-gold-500/60 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gold-700/30 bg-ink-900/60">
            <img src={AVATAR} alt={NAME} className="w-9 h-9 rounded-full border-2 border-gold-500 object-cover" />
            <div className="flex-1">
              <p className="font-display text-gold-400 leading-none">{NAME}</p>
              <p className="text-[10px] text-paper-100/40 mt-0.5">Trả lời theo dữ liệu Hoán Vận</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="text-paper-100/50 hover:text-paper-50 text-lg leading-none px-1"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <img src={AVATAR} alt="" className="w-6 h-6 rounded-full border border-gold-700/50 object-cover mr-1.5 mt-0.5 shrink-0" />
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-gold-500/20 border border-gold-500/40 text-paper-50 rounded-br-sm"
                      : "bg-ink-900/70 border border-gold-700/30 text-paper-100/90 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                  {m.sourceLabel && <p className="text-[10px] text-jade-400 mt-1.5">Nguồn: {m.sourceLabel}</p>}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 p-2.5 border-t border-gold-700/30">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi Tiểu Thạch điều gì đó…"
              className="flex-1 bg-ink-800 border border-gold-700/40 rounded-full px-3.5 py-2 text-sm text-paper-50 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-ink-950 transition-colors text-sm shrink-0"
            >
              Gửi
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng trợ lý Tiểu Thạch" : "Mở trợ lý Tiểu Thạch"}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full border-[3px] border-gold-500 shadow-lg shadow-black/50 overflow-hidden bg-ink-900 hover:scale-105 transition-transform"
      >
        <img src={AVATAR} alt="Tiểu Thạch" className="w-full h-full object-cover" />
      </button>
    </>
  );
}

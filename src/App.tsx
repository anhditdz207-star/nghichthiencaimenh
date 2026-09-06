import { useState } from "react";
import TaijiSymbol from "./components/Taiji";
import GieoQuePage from "./pages/GieoQuePage";
import TraCuuPage from "./pages/TraCuuPage";
import LichAmPage from "./pages/LichAmPage";
import BanMenhPage from "./pages/BanMenhPage";
import PhongThuyPage from "./pages/PhongThuyPage";
import ChatWidget from "./components/ChatWidget";

type Tab = "gieo" | "tracuu" | "licham" | "banmenh" | "phongthuy";

const TABS: { key: Tab; label: string }[] = [
  { key: "gieo", label: "Gieo Quẻ" },
  { key: "tracuu", label: "Tra Cứu" },
  { key: "licham", label: "Lịch Âm" },
  { key: "banmenh", label: "Bản Mệnh" },
  { key: "phongthuy", label: "Phong Thủy" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("gieo");

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 flex flex-col">
      <header className="border-b border-gold-700/30 sticky top-0 bg-ink-950/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
            <TaijiSymbol size={26} />
            <span className="font-display text-lg sm:text-xl tracking-wide text-paper-50">Hoán Vận</span>
          </div>
          <nav className="flex gap-1 justify-center sm:justify-end overflow-x-auto no-scrollbar -mx-1 px-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors duration-300 ${
                  tab === t.key
                    ? "text-gold-400 bg-gold-500/10 border border-gold-500/40"
                    : "text-paper-100/60 hover:text-paper-100 border border-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {tab === "gieo" && <GieoQuePage />}
        {tab === "tracuu" && <TraCuuPage />}
        {tab === "licham" && <LichAmPage />}
        {tab === "banmenh" && <BanMenhPage />}
        {tab === "phongthuy" && <PhongThuyPage />}
      </main>

      <footer className="border-t border-gold-700/20 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-4 text-[11px] text-paper-100/30 text-center">
          Hoán Vận
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}

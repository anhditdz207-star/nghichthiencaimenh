interface MethodToggleProps {
  value: "tamdong" | "maihoa";
  onChange: (v: "tamdong" | "maihoa") => void;
}

export default function MethodToggle({ value, onChange }: MethodToggleProps) {
  const isMaiHoa = value === "maihoa";
  return (
    <div className="inline-flex bg-ink-800 border border-gold-700/40 rounded-full p-1 text-[11px] sm:text-xs select-none">
      <button
        onClick={() => onChange("tamdong")}
        className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
          !isMaiHoa ? "bg-gold-500/20 border border-gold-500/50 text-gold-400" : "border border-transparent text-paper-100/50"
        }`}
      >
        <span className="sm:hidden">Tam Đồng</span>
        <span className="hidden sm:inline">Tam Đồng Pháp</span>
      </button>
      <button
        onClick={() => onChange("maihoa")}
        className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
          isMaiHoa ? "bg-gold-500/20 border border-gold-500/50 text-gold-400" : "border border-transparent text-paper-100/50"
        }`}
      >
        Mai Hoa
      </button>
    </div>
  );
}

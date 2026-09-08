interface MethodToggleProps {
  value: "tamdong" | "maihoa";
  onChange: (v: "tamdong" | "maihoa") => void;
}

export default function MethodToggle({ value, onChange }: MethodToggleProps) {
  const isMaiHoa = value === "maihoa";
  return (
    <div className="relative inline-flex bg-ink-800 border border-gold-700/40 rounded-full p-1 text-[11px] sm:text-xs select-none">
      <div
        className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gold-500/20 border border-gold-500/50 transition-transform duration-300 ease-in-out ${
          isMaiHoa ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <button
        onClick={() => onChange("tamdong")}
        className={`relative z-10 px-3 py-1.5 rounded-full transition-colors ${!isMaiHoa ? "text-gold-400" : "text-paper-100/50"}`}
      >
        Tam Đồng Pháp
      </button>
      <button
        onClick={() => onChange("maihoa")}
        className={`relative z-10 px-3 py-1.5 rounded-full transition-colors ${isMaiHoa ? "text-gold-400" : "text-paper-100/50"}`}
      >
        Mai Hoa
      </button>
    </div>
  );
}

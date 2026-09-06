import { useState } from "react";
import BaguaWheel from "./BaguaWheel";
import { startBgMusic } from "../lib/bgMusic";
import { playOneShot } from "../lib/sound";

const SPIN_MS = 4000;
const FADE_MS = 400;
const SPLIT_MS = 700;

type Phase = "idle" | "spinning" | "fading" | "splitting";

export default function IntroSplash({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");

  function handleEnter() {
    if (phase !== "idle") return;
    setPhase("spinning");
    startBgMusic();
    playOneShot("./spin-intro.mp3", 0.85);

    setTimeout(() => {
      setPhase("fading");
      setTimeout(() => {
        setPhase("splitting");
        setTimeout(() => {
          onEnter();
        }, SPLIT_MS);
      }, FADE_MS);
    }, SPIN_MS);
  }

  const splitting = phase === "splitting";
  const dimmed = phase === "fading" || phase === "splitting";

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-ink-950 transition-transform ease-in-out ${splitting ? "-translate-x-full" : "translate-x-0"}`}
        style={{ transitionDuration: `${SPLIT_MS}ms` }}
      />
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-ink-950 transition-transform ease-in-out ${splitting ? "translate-x-full" : "translate-x-0"}`}
        style={{ transitionDuration: `${SPLIT_MS}ms` }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-6 transition-opacity"
          style={{ transitionDuration: `${FADE_MS}ms`, opacity: dimmed ? 0 : 1 }}
        >
          <button
            onClick={handleEnter}
            disabled={phase !== "idle"}
            aria-label="Chạm vào Thái Cực để vào Hoán Vận"
            className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <BaguaWheel spinning={phase === "spinning"} size={260} durationMs={SPIN_MS} taijiGlow />
          </button>
          {phase === "idle" && (
            <p className="text-gold-500/70 text-sm font-display tracking-wide animate-pulse">
              Chạm vào Thái Cực để bắt đầu
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

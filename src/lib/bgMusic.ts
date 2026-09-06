let audio: HTMLAudioElement | null = null;
let listeners: Array<(muted: boolean) => void> = [];

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio("./bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.32;
  }
  return audio;
}

/** Bắt đầu phát nhạc nền (gọi trong lúc có tương tác người dùng, vd. sự kiện click) */
export function startBgMusic(): void {
  const a = getAudio();
  void a.play().catch(() => {
    // bỏ qua nếu bị chặn autoplay
  });
}

export function isBgMusicMuted(): boolean {
  return audio?.muted ?? false;
}

export function toggleBgMusicMute(): boolean {
  const a = getAudio();
  a.muted = !a.muted;
  listeners.forEach((fn) => fn(a.muted));
  return a.muted;
}

export function onBgMusicMuteChange(fn: (muted: boolean) => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

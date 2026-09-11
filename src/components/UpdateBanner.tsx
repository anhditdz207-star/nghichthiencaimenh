import { useEffect, useState } from "react";
import { onUpdateAvailable, applyUpdate } from "../lib/updateNotifier";

export default function UpdateBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => onUpdateAvailable(() => setShow(true)), []);

  if (!show) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[200] bg-gold-500 text-ink-950 text-sm px-4 py-2.5 flex items-center justify-center gap-4 shadow-lg">
      <span>🪷 Đã có bản cập nhật mới cho Hoán Vận</span>
      <button
        onClick={applyUpdate}
        className="px-3 py-1 rounded-full bg-ink-950 text-gold-400 font-display text-xs hover:bg-ink-800 transition-colors"
      >
        Tải lại
      </button>
    </div>
  );
}

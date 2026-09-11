type Listener = () => void;

let listeners: Listener[] = [];
let waitingWorker: ServiceWorker | null = null;

/** Đăng ký lắng nghe khi có bản cập nhật mới đang chờ áp dụng */
export function onUpdateAvailable(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

function notify(worker: ServiceWorker) {
  waitingWorker = worker;
  listeners.forEach((fn) => fn());
}

/** Áp dụng bản mới: báo cho service worker đang chờ kích hoạt, rồi tải lại trang */
export function applyUpdate(): void {
  if (waitingWorker) {
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }
  window.location.reload();
}

/** Gắn vào registration của service worker để theo dõi bản cập nhật mới */
export function watchForUpdates(registration: ServiceWorkerRegistration): void {
  // Nếu đã có sẵn một bản đang chờ (vd. cài xong lúc tab chưa mở)
  if (registration.waiting && navigator.serviceWorker.controller) {
    notify(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing;
    if (!newWorker) return;
    newWorker.addEventListener("statechange", () => {
      if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
        notify(newWorker);
      }
    });
  });
}

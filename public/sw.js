const CACHE = "hoanvan-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Trang HTML (điều hướng): luôn ưu tiên lấy bản mới nhất từ mạng trước,
  // chỉ dùng bản cache khi mất mạng — để không bao giờ phải bấm Ctrl+Shift+R.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match("./")))
    );
    return;
  }

  // Các file tĩnh khác (JS/CSS/ảnh): tên file có mã hash theo nội dung nên dùng
  // cache trước cho nhanh, mạng chỉ dùng khi chưa có trong cache.
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            return res;
          })
          .catch(() => cached)
    )
  );
});

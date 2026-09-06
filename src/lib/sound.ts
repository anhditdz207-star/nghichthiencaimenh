/** Phát một âm thanh ngắn (hiệu ứng), không lặp, bỏ qua nếu trình duyệt chặn autoplay */
export function playOneShot(src: string, volume = 1): void {
  try {
    const audio = new Audio(src);
    audio.volume = Math.min(1, Math.max(0, volume));
    void audio.play().catch(() => {
      // trình duyệt có thể chặn phát âm thanh nếu chưa có tương tác người dùng — bỏ qua lặng lẽ
    });
  } catch {
    // bỏ qua nếu môi trường không hỗ trợ Audio
  }
}

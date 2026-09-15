# Nâng cấp Tiểu Thạch: kết nối Gemini API (miễn phí, giấu key an toàn)

Tiểu Thạch vẫn tra dữ liệu có sẵn của web trước (miễn phí, tức thì). Chỉ khi KHÔNG tìm thấy trong
dữ liệu, web mới gọi qua Cloudflare Worker này để hỏi Gemini — vừa tiết kiệm lượt gọi API, vừa
không lộ key cho ai lấy trộm.

## Bước 1 — Lấy API key Gemini (miễn phí)

1. Vào **https://aistudio.google.com/apikey**
2. Đăng nhập bằng tài khoản Google
3. Bấm **"Create API key"** → copy chuỗi key đó lại (dạng `AIzaSy...`)

## Bước 2 — Tạo Cloudflare Worker (miễn phí, không cần thẻ)

1. Vào **https://dash.cloudflare.com/** → đăng ký tài khoản (miễn phí)
2. Vào mục **Workers & Pages** → **Create** → **Create Worker**
3. Đặt tên bất kỳ, ví dụ `hoanvan-ai` → **Deploy** (nó sẽ tạo 1 worker mẫu trước)
4. Sau khi deploy xong, bấm **Edit code**
5. Xoá hết code mẫu, dán toàn bộ nội dung file **`worker.js`** (cùng thư mục với file này) vào
6. Bấm **Deploy** (hoặc **Save and deploy**)

## Bước 3 — Gắn API key vào Worker (bí mật, không lộ ra ngoài)

1. Ở trang Worker vừa tạo → vào tab **Settings** → **Variables and Secrets**
2. Bấm **Add variable** → chọn kiểu **Secret** (không phải Text thường)
3. Tên biến: `GEMINI_API_KEY` → Giá trị: dán API key lấy ở Bước 1 vào
4. Save

## Bước 4 — Lấy URL của Worker

Sau khi deploy, Cloudflare cho bạn 1 link dạng:
```
https://hoanvan-ai.<tên-bạn>.workers.dev
```
Copy link này gửi lại cho mình (hoặc tự dán vào file `src/lib/aiFallback.ts`, chỗ biến `WORKER_URL`).

## Bước 5 — Kiểm tra thử (không bắt buộc, nhưng nên làm)

Mở terminal, chạy thử (thay link của bạn vào):
```bash
curl -X POST https://hoanvan-ai.<ten-ban>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"question":"Thủ đô Việt Nam là gì?"}'
```
Nếu thấy trả về JSON có `"answer": "..."` là thành công.

---

**Lưu ý:** Cloudflare free tier cho 100.000 request/ngày — với quy mô Tiểu Thạch thì gần như không
bao giờ chạm giới hạn. Gemini free tier riêng mới là giới hạn thật (1.500 request/ngày) — nhưng vì
Tiểu Thạch chỉ gọi Gemini khi dữ liệu có sẵn KHÔNG trả lời được, nên số lượt gọi thực tế sẽ ít hơn
nhiều so với tổng số câu hỏi người dùng gõ vào.

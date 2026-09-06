# Hoán Vận — Web Tra Cứu Kinh Dịch

Web tĩnh tra cứu Kinh Dịch mang tên **Hoán Vận** (chuyển đổi vận số): gieo quẻ tức thời (tam đồng pháp), tra cứu 64 quẻ, xem lịch âm Việt Nam. Phong cách thiết kế Đạo gia (đen — trắng ngà — vàng kim — đỏ son).

## Chạy thử

```bash
npm install
npm run dev
```

## Build & test

```bash
npm run build   # tsc + vite build -> dist/
npm test        # vitest: thuật toán âm lịch + tam đồng pháp
```

## Deploy GitHub Pages

Đã có sẵn `.github/workflows/deploy.yml`: push lên nhánh `main`, vào Settings → Pages → Source chọn "GitHub Actions" (chỉ cần bật một lần), CI sẽ tự build và deploy.
`vite.config.ts` dùng `base: './'` nên không cần biết trước tên repo.

## Kiến trúc

- `src/data/` — 64 quẻ (`hexagrams.ts`), 8 quái (`trigrams.ts`), kiểu dữ liệu (`types.ts`)
- `src/lib/coin-toss.ts` — thuật toán tam đồng pháp
- `src/lib/lunar.ts` — chuyển đổi dương lịch ↔ âm lịch (thuật toán thiên văn, múi giờ VN), can chi, tiết khí
- `src/lib/interpret.ts` — ghép kết quả gieo với dữ liệu quẻ
- `src/lib/history.ts` — lưu lịch sử gieo quẻ vào localStorage
- `src/pages/` — 4 trang: Gieo Quẻ, Tra Cứu, Lịch Âm, Bản Mệnh
- `src/components/` — `HexagramGlyph` (vẽ 6 hào), `Taiji` (âm dương, dùng chung cho logo và vòng bát quái), `LotusSymbol` (hoa sen), `ChatWidget` (bong bóng chat Tiểu Thạch), `IntroSplash` (màn chào), `MusicToggle` (nút nhạc nền)
- `src/lib/destiny.ts` — ngũ hành nạp âm, mệnh quái Bát Trạch, màu hợp mệnh
- `src/lib/hourly.ts` — giờ hoàng đạo theo ngày

## Trạng thái nội dung

- 64/64 quẻ đã có: tên, quái từ tổng quan, ý nghĩa, việc nên làm / không nên làm, thời cơ — tự diễn giải, không sao chép bản dịch có bản quyền nào.
- Hào từ chi tiết từng hào: **64/64 quẻ đã hoàn thành** — đủ 384 hào, tự diễn giải bằng lời riêng dựa trên tinh thần chung của Kinh Dịch truyền thống, không sao chép bản dịch có bản quyền nào.
- Chia sẻ kết quả gieo quẻ: đã có — nút "Chia sẻ liên kết" mã hoá quẻ chính/biến/hào động vào URL (`?q=&c=&m=`), người nhận link thấy ngay kết quả mà không cần backend.
- PWA: đã có `manifest.webmanifest` + `sw.js` (cache-first cơ bản, offline được sau lần truy cập đầu).
- Mỗi quẻ có thêm góc nhìn "tu tâm" (tinh thần Phật pháp) — 🪷, hiển thị cùng luận giải.
- Trang Bản Mệnh: ngũ hành nạp âm theo năm sinh, mệnh quái Bát Trạch (Đông tứ/Tây tứ mệnh + hướng hợp), màu hợp mệnh, giờ hoàng đạo trong ngày.
- Giao diện ưu tiên di động (header sticky, chữ/khoảng cách co giãn theo màn hình dọc).
- Trang Phong Thủy: 114 quy tắc phong thủy nhà ở (gộp, lọc trùng từ nhiều nguồn dân gian phổ biến), tra cứu theo 10 nhóm hoặc tìm kiếm từ khoá; có ô tải ảnh tham khảo (KHÔNG tự động phân tích ảnh — người dùng tự đối chiếu bằng mắt rồi tìm tình huống tương ứng).

## Ghi chú thuật toán âm lịch

`src/lib/lunar.ts` triển khai lại thuật toán thiên văn (không sao chép mã nguồn gốc) tham chiếu công trình của Hồ Ngọc Đức, múi giờ UTC+7. Đã kiểm chứng khớp với các mốc Tết đã biết (Quý Mão 2023, Giáp Thìn 2024, Ất Tỵ 2025) và can chi ngày/tháng/năm tham chiếu (1/1/2000 = Mậu Ngọ, tháng Bính Tý, năm Kỷ Mão).

- Bản Mệnh: đã thêm ngày/tháng sinh (không chỉ năm) — hiện ngày âm lịch + can chi ngày sinh, và mục Tam hợp / Lục hợp / Tứ hành xung theo Chi năm sinh (tuổi hợp làm ăn, hợp cưới hỏi, tuổi nên cân nhắc kỹ).
- Lịch Âm: bấm vào một ngày bất kỳ để xem Trực (thập nhị trực: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế) kèm việc nên làm / không nên làm trong ngày đó.

- **Tiểu Thạch** (trước gọi tạm "Trợ Lý"): bong bóng chat nổi ở góc dưới bên phải, hiện trên mọi trang (không còn là tab riêng). Trả lời dựa **hoàn toàn trên dữ liệu có sẵn** (FAQ Kinh Dịch/Lịch Âm/Mệnh Lý 185 mục + 228 quy tắc Phong Thủy) — không gọi AI ngoài, không bịa thông tin; có câu đùa khi không tìm thấy dữ liệu khớp. Avatar là ảnh viên đá do người dùng cung cấp (`public/tieuthach-avatar.png`).

- Gieo Quẻ: có thêm ô ghi lại **việc muốn hỏi** (tự niệm trong lòng, không ảnh hưởng thuật toán ngẫu nhiên) và mục **Lịch sử** xem lại các lượt gieo trước (lưu trong máy, tối đa 50 lượt, có nút xoá).

- **Màn chào (intro)**: hiện 1 lần mỗi phiên trình duyệt (dùng sessionStorage) — chạm vào Thái Cực đang xoay để vào web chính. Bấm vào: quẻ (vòng giữa) và Thái Cực xoay ngược chiều nhau ~5 giây kèm âm thanh xoay (`spin-intro.mp3`), đồng thời nhạc nền (`bg-music.mp3`, lặp vô hạn) bắt đầu phát; sau đó mờ dần rồi màn đen tách đôi mở ra trang chính. Tải lại trang trong cùng phiên sẽ vào thẳng, không cần chạm lại.
- **Âm thanh khi Gieo Quẻ**: vòng bát quái quay chậm lại còn ~6.5 giây, kèm âm thanh xoay (`spin-cast.mp3`) để đồng bộ với thời lượng quay.
- **Nút tắt/mở nhạc nền**: hình loa nhỏ góc dưới-trái, luôn hiện trên mọi trang.
- Cả 2 file âm thanh xoay (`spin-intro.mp3`, `spin-cast.mp3`) được cắt và tăng âm lượng vừa phải từ file `mixkit-bike-wheel-spinning-1613.wav` người dùng cung cấp (ffmpeg: trim + volume + fade), không dùng nguyên bản.

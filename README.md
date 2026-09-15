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

- Gieo Quẻ: vòng bát quái giờ quay nhanh, nhiều vòng hơn (vòng ngoài 3 vòng/5s, vòng giữa 2 vòng/6s, vòng trong 3 vòng/7s) — có thể **bấm thẳng vào vòng bát quái** để gieo, không bắt buộc bấm nút "Gieo quẻ". Nút "Gieo lại" giờ chỉ đưa về màn hình ban đầu (nhập câu hỏi mới), phải bấm gieo lại mới thực sự tung quẻ tiếp.
- Ô nhập câu hỏi có thêm dòng "*Nhất Niệm Sở Cầu*" (in nghiêng).
- Footer đổi thành "*Nghịch Thiên Cải Mệnh - Thuận Thiên Giúp Thế - Nhất Tâm Định Vạn Sự*" (in nghiêng).

- Gieo Quẻ: giảm bớt 1 giây mỗi vòng quay (ngoài 4s/3 vòng, giữa 5s/2 vòng, trong 6s/3 vòng), bố cục thu gọn để vừa 1 màn hình ở trạng thái chờ (không cần cuộn), kết quả sau khi gieo vẫn cuộn bình thường.
- Âm thanh xoay (`spin-intro.mp3`, `spin-cast.mp3`) làm lại: to ngay từ đầu rồi nhỏ dần đều tới cuối (khớp cảm giác bánh xe quay chậm dần), thời lượng khớp lại với thời gian quay mới.
- Footer thêm dòng "*by Nguyễn Trung*" in nghiêng.

- Tiểu Thạch giờ có thêm lớp "trò chuyện cơ bản" (`data/smalltalk.ts`, tách riêng khỏi FAQ kiến thức): chào hỏi, cảm ơn, tạm biệt, tự giới thiệu, biết ai là chủ web (Nguyễn Trung Nguyên), xác nhận không phải AI thật và hoàn toàn miễn phí, cùng vài câu hướng dẫn dùng web cơ bản (gieo quẻ, xem lịch sử, tắt nhạc...). Vẫn 100% dữ liệu tĩnh, không gọi AI/API trả phí nào.

- Tiểu Thạch: khi không tìm thấy dữ liệu khớp, kèm thêm link "🔍 Tìm trên Google" (tự tạo link tìm kiếm, không gọi API tìm kiếm trả phí nào).
- Bấm vào chữ "Hoán Vận"/biểu tượng âm dương ở header sẽ tải lại trang.
- Trang Gieo Quẻ: thêm nút chuyển phương pháp kiểu viên thuốc (góc trên-phải) giữa **Tam Đồng Pháp** (mặc định, đầy đủ) và **Mai Hoa Dịch Số** (khung "sắp ra mắt", thuật toán chưa xây — mặc định luôn quay lại Tam Đồng Pháp mỗi khi tải trang).

- **Mai Hoa Dịch Số** đã hoàn thành (không còn "sắp ra mắt"): lập quẻ theo thời điểm (năm/tháng/ngày/giờ âm lịch, mặc định dùng thời điểm hiện tại hoặc tự chọn), tính quẻ chính + quẻ biến, xác định Thể/Dụng và luận ngũ hành sinh khắc (5 trường hợp: đồng hành, Thể sinh Dụng, Dụng sinh Thể, Thể khắc Dụng, Dụng khắc Thể). Công thức đã đối chiếu với ví dụ mẫu và có 9 unit test riêng (`lib/maihoa.ts`, `lib/__tests__/maihoa.test.ts`).

- Sửa lỗi hiển thị di động: nút chuyển phương pháp (Tam Đồng Pháp/Mai Hoa) trước dùng `absolute` nên chồng lên header khi cuộn — đổi sang nằm trong luồng bình thường ở đầu trang, không còn chồng chéo; rút gọn nhãn trên màn hình hẹp. Footer thêm khoảng đệm dưới để không bị 2 nút nổi (Tiểu Thạch, nhạc) che chữ.
- Phong Thủy: **bỏ hẳn ô tải ảnh** (không có tác dụng thực tế, sẽ nâng cấp hợp lý hơn vào Tiểu Thạch sau này nếu có điều kiện) — chỉ còn tìm kiếm theo từ khoá, ô tìm kiếm được làm nổi bật hơn (to hơn, có icon kính lúp) ở đầu trang.

- Sửa lỗi tràn viên nang chuyển phương pháp (2 nút chữ dài ngắn khác nhau nhưng thanh trượt ép cứng 50/50) — bỏ kiểu trượt, tô màu trực tiếp theo nút đang chọn.
- Thêm dòng "Tam Đồng Pháp mang tính tham khảo, không phải kết luận cố định." ở cuối phần Gieo Quẻ, đồng bộ với dòng tương tự đã có ở Mai Hoa.
- **Tối ưu bundle JS**: tách nhỏ từng trang bằng `React.lazy` + `Suspense` (Gieo Quẻ, Tra Cứu, Lịch Âm, Bản Mệnh, Phong Thủy, Mai Hoa, Tiểu Thạch đều tải riêng khi cần). Bundle chính giảm từ ~500KB xuống còn ~200KB (gzip ~64KB), không còn cảnh báo "chunk quá lớn" khi build.

- **Kiểm chứng Mai Hoa Dịch Số với nhiều nguồn** (Wikipedia, vugioi.com, hocvienlyso.org, nguồn Hán ngữ Chinese Text Project/zhihu): xác nhận quy tắc Thể/Dụng hiện tại đúng (quái chứa hào động là Dụng, quái còn lại là Thể — phát hiện 2 bài blog Việt ghi ngược, đã loại). Sửa lại công thức tính hào động cho khớp đa số nguồn: dùng tổng 2 số quái đã rút gọn (không phải tổng thô năm+tháng+ngày+giờ) — 2 cách cho kết quả khác nhau ở đa số trường hợp, đã thêm test khoá lại đúng công thức mới.
- Mai Hoa: thêm ô "Điều bạn muốn hỏi" (kèm "*Nhất Niệm Sở Cầu*", không bắt buộc) — chỉ hiển thị "Việc hỏi: ...", không dùng để tính toán, đồng bộ đúng kiểu với Tam Đồng Pháp.

- **Thông báo cập nhật**: đã thử banner hỏi người dùng, nhưng theo yêu cầu đã đảo lại **về tự động cập nhật** (service worker tự `skipWaiting()` như ban đầu) — không hỏi, không banner.
- **Nâng cấp Tiểu Thạch với AI (tuỳ chọn, cần tự cấu hình)**: khi dữ liệu có sẵn (FAQ + Phong Thủy) không
  trả lời được, Tiểu Thạch có thể gọi qua **Gemini API** (miễn phí) để tổng hợp câu trả lời ngắn gọn,
  thay vì chỉ đưa link Google. Không bắt buộc — nếu chưa cấu hình, Tiểu Thạch vẫn hoạt động như cũ
  (thuần dữ liệu tĩnh).
  - Code Worker giấu API key: `cloudflare-worker/worker.js`
  - Hướng dẫn deploy từng bước: `cloudflare-worker/README.md`
  - Sau khi deploy, dán URL Worker vào `src/lib/aiFallback.ts` (biến `WORKER_URL`)

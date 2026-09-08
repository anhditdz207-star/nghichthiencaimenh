/** Trò chuyện cơ bản + hướng dẫn dùng web — tách riêng khỏi kiến thức Kinh Dịch/Phong Thủy/Mệnh lý.
 * Mỗi mục có nhiều "triggers" (cách hỏi khác nhau, đã chuẩn hoá không dấu) khớp CHÍNH XÁC toàn bộ câu
 * (sau khi chuẩn hoá) để tránh nhận nhầm — chỉ dùng cho câu ngắn, mang tính giao tiếp, không phải tra cứu. */

export interface SmallTalkItem {
  triggers: string[]; // đã chuẩn hoá: chữ thường, bỏ dấu
  answers: string[]; // chọn ngẫu nhiên 1 trong số này khi trả lời
}

export const SMALL_TALK: SmallTalkItem[] = [
  {
    triggers: ["chao", "chao ban", "xin chao", "hello", "hi", "alo", "chao tieu thach", "helo"],
    answers: [
      "Chào bạn! Mình là Tiểu Thạch 🪨 — hỏi mình về Kinh Dịch, lịch âm, mệnh lý hay phong thủy nhà cửa đều được nhé.",
      "Chào chào! Có gì cần Tiểu Thạch tra giúp không? ☯️",
    ],
  },
  {
    triggers: ["cam on", "cam on ban", "cam on nhe", "thanks", "thank you", "cam on tieu thach"],
    answers: [
      "Không có gì đâu, mình vui vì giúp được bạn 🪷",
      "Cảm ơn bạn đã hỏi mình nhé, có gì cứ quay lại!",
    ],
  },
  {
    triggers: ["tam biet", "bye", "chao tam biet", "hen gap lai"],
    answers: ["Hẹn gặp lại bạn nhé! 👋", "Tạm biệt, chúc bạn mọi sự hanh thông ☯️"],
  },
  {
    triggers: ["ban la ai", "ban ten gi", "tieu thach la ai", "ban la gi", "gioi thieu ban di"],
    answers: [
      "Mình tên Tiểu Thạch — trợ lý nhỏ của Hoán Vận. Mình không phải AI thật đâu, chỉ trả lời dựa trên kho dữ liệu có sẵn của web thôi (Kinh Dịch, lịch âm, mệnh lý, phong thủy), nên hỏi ngoài mấy chủ đề đó thì mình chịu 😅",
    ],
  },
  {
    triggers: [
      "ai tao ra ban", "ai lam ra ban", "chu web la ai", "ai lam web nay",
      "ai lam ra web nay", "ai tao ra web nay", "web nay cua ai",
      "tac gia web nay la ai", "ai viet web nay", "ai tao ra hoan van",
    ],
    answers: [
      "Web Hoán Vận này do Nguyễn Trung Nguyên tạo ra — bạn xem tên ở cuối trang (footer) đó.",
    ],
  },
  {
    triggers: ["ban co phai ai khong", "ban co phai ai that khong", "ban co phai chatgpt khong", "ban co thong minh khong", "ban co phai robot khong"],
    answers: [
      "Không, mình không phải AI thật như ChatGPT hay Gemini đâu — mình chỉ so khớp câu hỏi của bạn với kho dữ liệu có sẵn của Hoán Vận thôi, kiểu tra cứu thông minh một chút vậy đó 🪨",
    ],
  },
  {
    triggers: ["web nay co mien phi khong", "dung web co mat tien khong", "tro ly co mien phi khong", "hoi tieu thach co mat phi khong"],
    answers: [
      "Miễn phí hoàn toàn nhé! Mình chỉ chạy bằng dữ liệu có sẵn, không gọi AI trả phí nào cả, nên bạn cứ hỏi thoải mái.",
    ],
  },
  {
    triggers: ["gieo que the nao", "lam sao de gieo que", "cach gieo que", "gieo que o dau"],
    answers: [
      "Vào tab \"Gieo Quẻ\", gõ điều bạn muốn hỏi (không bắt buộc) rồi bấm nút \"Gieo quẻ\" hoặc chạm thẳng vào vòng bát quái đang xoay — đợi nó quay xong là ra quẻ liền.",
    ],
  },
  {
    triggers: ["lich su gieo que o dau", "xem lai lich su o dau", "lam sao xem lich su gieo que"],
    answers: [
      "Ở trang Gieo Quẻ, ngay dưới dòng giới thiệu có chữ \"Lịch sử (số lượt)\" — bấm vào đó là xem lại được, có cả nút xoá hết nếu muốn.",
    ],
  },
  {
    triggers: ["tat nhac the nao", "lam sao tat nhac", "sao khong tat duoc nhac", "nut tat nhac o dau"],
    answers: [
      "Có nút hình loa nhỏ ở góc dưới bên trái màn hình, bấm vào là tắt/mở nhạc nền được nhé.",
    ],
  },
  {
    triggers: ["ban menh la gi", "xem ban menh o dau", "menh quai xem the nao"],
    answers: [
      "Vào tab \"Bản Mệnh\", nhập ngày sinh và giới tính là ra ngay ngũ hành nạp âm, mệnh quái, tuổi hợp-khắc và giờ hoàng đạo trong ngày.",
    ],
  },
  {
    triggers: ["phong thuy xem the nao", "tra cuu phong thuy o dau"],
    answers: [
      "Vào tab \"Phong Thủy\", chọn nhóm (cửa chính, giường ngủ, bếp...) hoặc gõ từ khoá để tìm nhanh tình huống bạn quan tâm.",
    ],
  },
];

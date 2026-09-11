import { describe, expect, it } from "vitest";
import { tinhMaiHoa, hourToChiIndex, xetTheDung } from "../maihoa";

describe("hourToChiIndex", () => {
  it("giờ Thìn (7-9h) trả về chỉ số 5", () => {
    expect(hourToChiIndex(7)).toBe(5);
    expect(hourToChiIndex(8)).toBe(5);
  });
  it("giờ Tý (23h-1h) trả về chỉ số 1", () => {
    expect(hourToChiIndex(23)).toBe(1);
    expect(hourToChiIndex(0)).toBe(1);
  });
});

describe("tinhMaiHoa", () => {
  // Ví dụ đối chiếu: năm Tý(1), tháng 6, ngày 15, giờ Thìn(5) -> quẻ chính Thủy Hỏa Ký Tế, hào động 3
  it("khớp ví dụ mẫu: quẻ chính Ký Tế, hào động 3", () => {
    const r = tinhMaiHoa(1, 6, 15, 5);
    expect(r.upperTrigram).toBe("khảm");
    expect(r.lowerTrigram).toBe("ly");
    expect(r.mainBinary).toBe("101010");
    expect(r.movingLine).toBe(3);
    expect(r.theTrigram).toBe("khảm");
    expect(r.dungTrigram).toBe("ly");
  });

  it("hào động lật đúng vị trí trong quẻ biến", () => {
    const r = tinhMaiHoa(1, 6, 15, 5);
    for (let i = 0; i < 6; i++) {
      if (i === r.movingLine - 1) {
        expect(r.changedBinary[i]).not.toBe(r.mainBinary[i]);
      } else {
        expect(r.changedBinary[i]).toBe(r.mainBinary[i]);
      }
    }
  });

  it("hào động = tổng 2 số quái đã rút gọn mod 6, không phải tổng thô Y+M+D+H mod 6", () => {
    // Y=3,M=4,D=5,H=2: upper=(3+4+5)%8=4 ; lower=(4+2)%8=6 ; hào động=(4+6)%6=4
    // (nếu dùng tổng thô 3+4+5+2=14, 14%6=2 — SAI, hai cách cho kết quả khác nhau ở bộ số này)
    const r = tinhMaiHoa(3, 4, 5, 2);
    expect(r.movingLine).toBe(4);
  });
});

describe("xetTheDung", () => {
  it("Thể khắc Dụng -> Tốt", () => {
    expect(xetTheDung("Thủy", "Hỏa").mucDo).toBe("tot");
  });
  it("Dụng khắc Thể -> Rất xấu", () => {
    expect(xetTheDung("Hỏa", "Thủy").mucDo).toBe("rat_xau");
  });
  it("Dụng sinh Thể -> Rất tốt", () => {
    expect(xetTheDung("Hỏa", "Mộc").mucDo).toBe("rat_tot");
  });
  it("Thể sinh Dụng -> Xấu", () => {
    expect(xetTheDung("Mộc", "Hỏa").mucDo).toBe("xau");
  });
  it("đồng hành -> Tốt", () => {
    expect(xetTheDung("Kim", "Kim").mucDo).toBe("tot");
  });
});

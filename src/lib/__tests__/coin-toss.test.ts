import { describe, expect, it } from "vitest";
import { castHexagram, castLine, manualHexagram } from "../coin-toss";

describe("castLine", () => {
  it("tổng luôn thuộc {6,7,8,9}", () => {
    for (let i = 0; i < 500; i++) {
      const line = castLine(1);
      expect([6, 7, 8, 9]).toContain(line.sum);
    }
  });

  it("6 và 9 là hào động, 7 và 8 là hào tĩnh", () => {
    // ép rng để kiểm tra từng trường hợp: 0 -> sấp, gần 1 -> ngửa
    const allSap = () => 0.1; // luôn sấp -> 3 sấp = 6
    const allNgua = () => 0.9; // luôn ngửa -> 3 ngửa = 9
    const lineSap = castLine(1, allSap);
    const lineNgua = castLine(1, allNgua);
    expect(lineSap.sum).toBe(6);
    expect(lineSap.isMoving).toBe(true);
    expect(lineSap.isYangPrimary).toBe(false); // lão âm -> quẻ chính là âm
    expect(lineNgua.sum).toBe(9);
    expect(lineNgua.isMoving).toBe(true);
    expect(lineNgua.isYangPrimary).toBe(true); // lão dương -> quẻ chính là dương
  });
});

describe("castHexagram", () => {
  it("sinh đủ 6 hào và chuỗi nhị phân 6 ký tự", () => {
    const cast = castHexagram();
    expect(cast.lines).toHaveLength(6);
    expect(cast.primaryBinary).toHaveLength(6);
  });

  it("khi không có hào động thì không có quẻ biến", () => {
    // rng cố định để luôn ra 2 sấp 1 ngửa (tổng 7, thiếu dương, tĩnh)
    let call = 0;
    const rng = () => (call++ % 3 === 0 ? 0.9 : 0.1); // 1 ngửa, 2 sấp mỗi hào
    const cast = castHexagram(rng);
    expect(cast.hasMovingLines).toBe(false);
    expect(cast.changedBinary).toBe("");
  });

  it("hào động trong quẻ biến phải đảo ngược đúng so với quẻ chính", () => {
    const allNgua = () => 0.9; // toàn lão dương -> mọi hào đều động, đảo hết thành âm
    const cast = castHexagram(allNgua);
    expect(cast.primaryBinary).toBe("111111");
    expect(cast.hasMovingLines).toBe(true);
    expect(cast.changedBinary).toBe("000000");
  });
});

describe("manualHexagram", () => {
  it("tạo quẻ tĩnh từ 6 hào tự chọn, không có hào động", () => {
    const cast = manualHexagram([true, true, true, false, false, false]);
    expect(cast.primaryBinary).toBe("111000");
    expect(cast.hasMovingLines).toBe(false);
  });

  it("báo lỗi nếu không đủ 6 hào", () => {
    expect(() => manualHexagram([true, false])).toThrow();
  });
});

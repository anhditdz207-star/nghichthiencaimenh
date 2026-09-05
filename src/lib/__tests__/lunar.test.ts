import { describe, expect, it } from "vitest";
import { solarToLunar, canChiNgay, canChiThang, canChiNam, jdFromDate } from "../lunar";

describe("solarToLunar", () => {
  it("khớp mùng 1 Tết Giáp Thìn (10/2/2024)", () => {
    const l = solarToLunar(10, 2, 2024);
    expect(l.day).toBe(1);
    expect(l.month).toBe(1);
    expect(l.year).toBe(2024);
  });

  it("khớp mùng 1 Tết Quý Mão (22/1/2023)", () => {
    const l = solarToLunar(22, 1, 2023);
    expect(l.day).toBe(1);
    expect(l.month).toBe(1);
    expect(l.year).toBe(2023);
  });

  it("khớp mùng 1 Tết Ất Tỵ (29/1/2025)", () => {
    const l = solarToLunar(29, 1, 2025);
    expect(l.day).toBe(1);
    expect(l.month).toBe(1);
    expect(l.year).toBe(2025);
  });

  it("1/1/2000 âm lịch là 25/11 năm Kỷ Mão", () => {
    const l = solarToLunar(1, 1, 2000);
    expect(l.day).toBe(25);
    expect(l.month).toBe(11);
    expect(l.year).toBe(1999);
  });
});

describe("can chi", () => {
  it("ngày 1/1/2000 là ngày Mậu Ngọ", () => {
    expect(canChiNgay(jdFromDate(1, 1, 2000))).toBe("Mậu Ngọ");
  });

  it("tháng 11 năm Kỷ Mão (1999) là tháng Bính Tý", () => {
    expect(canChiThang(11, 1999)).toBe("Bính Tý");
  });

  it("năm 1999 là năm Kỷ Mão", () => {
    expect(canChiNam(1999)).toBe("Kỷ Mão");
  });

  it("năm 2024 là năm Giáp Thìn", () => {
    expect(canChiNam(2024)).toBe("Giáp Thìn");
  });
});

import { describe, it, expect } from "vitest";
import {
  convertToAllBases,
  convertBase,
  generateConversionSteps,
  convertIPToAllBases,
  sanitizeInput,
  isValidBaseValue,
} from "@/lib/numberSystems";

describe("Number System Conversions", () => {
  it("should sanitize inputs correctly with comma/dot", () => {
    expect(sanitizeInput("0b1101,101", "bin")).toBe("1101.101");
    expect(sanitizeInput("0o755.4", "oct")).toBe("755.4");
    expect(sanitizeInput("0xFF,8", "hex")).toBe("FF.8");
    expect(sanitizeInput("255,5", "dec")).toBe("255.5");
  });

  it("should validate base inputs with comma and fraction", () => {
    expect(isValidBaseValue("110101,101", "bin")).toBe(true);
    expect(isValidBaseValue("110201", "bin")).toBe(false);
    expect(isValidBaseValue("754,4", "oct")).toBe(true);
    expect(isValidBaseValue("789", "oct")).toBe(false);
    expect(isValidBaseValue("12345,75", "dec")).toBe(true);
    expect(isValidBaseValue("123a", "dec")).toBe(false);
    expect(isValidBaseValue("1A3F,8", "hex")).toBe(true);
    expect(isValidBaseValue("1G3F", "hex")).toBe(false);
  });

  it("should convert correctly between all 4 bases for decimal 255", () => {
    const res = convertToAllBases("255", "dec");
    expect(res).not.toBeNull();
    expect(res?.bin).toBe("11111111");
    expect(res?.oct).toBe("377");
    expect(res?.dec).toBe("255");
    expect(res?.hex).toBe("FF");
  });

  it("should convert correctly with comma fractional decimal (e.g. 255,5)", () => {
    const res = convertToAllBases("255,5", "dec");
    expect(res).not.toBeNull();
    expect(res?.bin).toBe("11111111,1");
    expect(res?.oct).toBe("377,4");
    expect(res?.hex).toBe("FF,8");
    expect(res?.dec).toBe("255,5");
  });

  it("should convert from binary with comma fractional (e.g. 1101,101)", () => {
    const res = convertToAllBases("1101,101", "bin");
    expect(res).not.toBeNull();
    expect(res?.bin).toBe("1101,101");
    expect(res?.oct).toBe("15,5");
    expect(res?.hex).toBe("D,A");
    expect(res?.dec).toBe("13,625");
  });

  it("should convert from octal 755 correctly", () => {
    const res = convertToAllBases("755", "oct");
    expect(res).not.toBeNull();
    expect(res?.dec).toBe("493");
    expect(res?.hex).toBe("1ED");
    expect(res?.bin).toBe("111101101");
  });

  it("should convert from hex 1A3F correctly", () => {
    const res = convertToAllBases("1A3F", "hex");
    expect(res).not.toBeNull();
    expect(res?.dec).toBe("6719");
    expect(res?.oct).toBe("15077");
    expect(res?.bin).toBe("1101000111111");
  });

  it("should convert 0 correctly across all bases", () => {
    const res = convertToAllBases("0", "dec");
    expect(res).not.toBeNull();
    expect(res?.bin).toBe("0");
    expect(res?.oct).toBe("0");
    expect(res?.dec).toBe("0");
    expect(res?.hex).toBe("0");
  });

  it("should convert directly between two bases with convertBase", () => {
    expect(convertBase("255", "dec", "hex")).toBe("FF");
    expect(convertBase("FF", "hex", "bin")).toBe("11111111");
    expect(convertBase("755", "oct", "dec")).toBe("493");
    expect(convertBase("invalid", "bin", "dec")).toBeNull();
  });

  it("should generate dual step-by-step explanations (Multiplication & Division) for all 16 base pairs", () => {
    const bases: Array<"bin" | "oct" | "dec" | "hex"> = ["bin", "oct", "dec", "hex"];
    const testValues: Record<string, string> = {
      bin: "110101",
      oct: "65",
      dec: "53",
      hex: "35",
    };

    for (const from of bases) {
      for (const to of bases) {
        const steps = generateConversionSteps(testValues[from], from, to);
        expect(steps, `Step failed for ${from} -> ${to}`).not.toBeNull();
        expect(steps?.outputClean).toBeTruthy();
        expect(steps?.multiplicationData).toBeDefined();
        expect(steps?.multiplicationData.rows.length).toBeGreaterThan(0);
        expect(steps?.divisionData).toBeDefined();
        expect(steps?.divisionData.rows.length).toBeGreaterThan(0);
      }
    }
  });

  it("should generate correct multiplication and division steps with comma support", () => {
    const steps = generateConversionSteps("255,5", "dec", "bin");
    expect(steps).not.toBeNull();
    expect(steps?.outputClean).toBe("11111111,1");
    expect(steps?.multiplicationData.rows.length).toBe(4); // 3 integer + 1 fractional
    expect(steps?.divisionData.fractionalRows).toBeDefined();
    expect(steps?.divisionData.fractionalRows?.length).toBeGreaterThan(0);
  });

  it("should convert IP to all formats accurately", () => {
    const ipRes = convertIPToAllBases("192.168.1.1");
    expect(ipRes).not.toBeNull();
    expect(ipRes?.dottedDecimal).toBe("192.168.1.1");
    expect(ipRes?.dottedBinary).toBe("11000000.10101000.00000001.00000001");
    expect(ipRes?.dottedHex).toBe("0xC0.0xA8.0x01.0x01");
    expect(ipRes?.dottedOctal).toBe("0300.0250.0001.0001");
    expect(ipRes?.integerDecimal).toBe("3232235777");
    expect(ipRes?.octets).toHaveLength(4);
  });
});

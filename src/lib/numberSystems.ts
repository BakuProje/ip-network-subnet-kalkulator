// Comprehensive Number System Conversion Utility (Binary, Octal, Decimal, Hexadecimal)
// Supports arbitrary-length precision, comma/period decimal fractions, and dual step-by-step methods (Multiplication & Division).

export type BaseType = "bin" | "oct" | "dec" | "hex";

export interface BaseInfo {
  id: BaseType;
  name: string;
  base: number;
  prefix: string;
  allowedChars: RegExp;
  placeholder: string;
  description: string;
}

export const BASE_CONFIGS: Record<BaseType, BaseInfo> = {
  bin: {
    id: "bin",
    name: "Biner",
    base: 2,
    prefix: "0b",
    allowedChars: /^[01]+([.,][01]+)?$/,
    placeholder: "Contoh: 11001010 atau 1101,101",
    description: "Basis 2 (digit 0 dan 1, pecahan koma)",
  },
  oct: {
    id: "oct",
    name: "Oktal",
    base: 8,
    prefix: "0o",
    allowedChars: /^[0-7]+([.,][0-7]+)?$/,
    placeholder: "Contoh: 312 atau 755,4",
    description: "Basis 8 (digit 0 sampai 7, pecahan koma)",
  },
  dec: {
    id: "dec",
    name: "Desimal",
    base: 10,
    prefix: "",
    allowedChars: /^[0-9]+([.,][0-9]+)?$/,
    placeholder: "Contoh: 255 atau 255,5",
    description: "Basis 10 (digit 0 sampai 9, pecahan koma)",
  },
  hex: {
    id: "hex",
    name: "Heksadesimal",
    base: 16,
    prefix: "0x",
    allowedChars: /^[0-9a-fA-F]+([.,][0-9a-fA-F]+)?$/,
    placeholder: "Contoh: FF atau CA,8",
    description: "Basis 16 (digit 0-9 dan huruf A-F, pecahan koma)",
  },
};

// Strip base prefix (0x, 0b, 0o) and whitespace
export function stripPrefix(input: string, base: BaseType): string {
  let clean = input.trim();
  if (base === "hex" && (clean.startsWith("0x") || clean.startsWith("0X"))) {
    clean = clean.slice(2);
  } else if (base === "oct" && (clean.startsWith("0o") || clean.startsWith("0O"))) {
    clean = clean.slice(2);
  } else if (base === "bin" && (clean.startsWith("0b") || clean.startsWith("0B"))) {
    clean = clean.slice(2);
  }
  return clean;
}

// Clean and normalize input string by removing invalid characters while keeping comma/dot
export function sanitizeInput(input: string, base: BaseType): string {
  let clean = stripPrefix(input, base).toUpperCase();
  // Normalize comma to dot for internal calculation
  clean = clean.replace(/,/g, ".");

  // Allow only valid characters for each base plus a single decimal point
  let regex: RegExp;
  if (base === "bin") regex = /[^01.]/g;
  else if (base === "oct") regex = /[^0-7.]/g;
  else if (base === "dec") regex = /[^0-9.]/g;
  else regex = /[^0-9A-F.]/g;

  clean = clean.replace(regex, "");

  // If multiple dots, retain only the first one
  const parts = clean.split(".");
  if (parts.length > 2) {
    clean = parts[0] + "." + parts.slice(1).join("");
  }

  return clean;
}

// Validate if input consists strictly of valid characters for the specified base (supports comma/period)
export function isValidBaseValue(value: string, base: BaseType): boolean {
  const stripped = stripPrefix(value, base).trim().toUpperCase().replace(/,/g, ".");
  if (!stripped || stripped === ".") return false;

  const parts = stripped.split(".");
  if (parts.length > 2) return false;

  const validRegex =
    base === "bin"
      ? /^[01]*$/
      : base === "oct"
      ? /^[0-7]*$/
      : base === "dec"
      ? /^[0-9]*$/
      : /^[0-9A-F]*$/;

  if (!validRegex.test(parts[0])) return false;
  if (parts.length === 2 && !validRegex.test(parts[1])) return false;

  // At least one part must not be empty
  return parts[0].length > 0 || (parts.length === 2 && parts[1].length > 0);
}

// Hex character value helpers
export const HEX_VALUES: Record<string, number> = {
  "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
  "8": 8, "9": 9, "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15,
};

export const VALUE_TO_HEX: Record<number, string> = {
  0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7",
  8: "8", 9: "9", 10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F",
};

// Convert fraction from decimal (0.xxx) to target base
export function convertFractionFromDecimal(
  fractionDec: number,
  targetBase: number,
  maxDigits: number = 6
): {
  fractionResult: string;
  steps: Array<{ step: number; input: number; multiplied: number; integerDigit: number; digitSymbol: string; nextFraction: number }>;
} {
  let cur = fractionDec;
  let fractionResult = "";
  const steps: Array<{ step: number; input: number; multiplied: number; integerDigit: number; digitSymbol: string; nextFraction: number }> = [];

  let step = 1;
  while (cur > 0.0000000001 && step <= maxDigits) {
    const mult = cur * targetBase;
    const intPart = Math.floor(mult);
    const nextFrac = mult - intPart;
    const symbol = targetBase === 16 ? VALUE_TO_HEX[intPart] : String(intPart);

    steps.push({
      step,
      input: cur,
      multiplied: mult,
      integerDigit: intPart,
      digitSymbol: symbol,
      nextFraction: nextFrac,
    });

    fractionResult += symbol;
    cur = nextFrac;
    step++;
  }

  return { fractionResult, steps };
}

// Convert from any base to all bases (with full comma/period fraction support)
export function convertToAllBases(value: string, fromBase: BaseType): {
  bin: string;
  oct: string;
  dec: string;
  hex: string;
  bigIntValue: bigint;
  hasFraction: boolean;
  decimalNumeric: number;
  formattedBin: string;
  formattedHex: string;
  formattedDec: string;
  formattedOct: string;
  bitLength: number;
  byteSize: number;
} | null {
  const clean = sanitizeInput(value, fromBase);
  if (!clean || !isValidBaseValue(clean, fromBase)) return null;

  try {
    const [intPartRaw = "0", fracPartRaw = ""] = clean.split(".");
    const intPart = intPartRaw || "0";
    const fromBaseNum = BASE_CONFIGS[fromBase].base;

    // Convert Integer part to BigInt & Number
    let bigNum: bigint;
    if (fromBase === "bin") bigNum = BigInt(`0b${intPart}`);
    else if (fromBase === "oct") bigNum = BigInt(`0o${intPart}`);
    else if (fromBase === "dec") bigNum = BigInt(intPart);
    else if (fromBase === "hex") bigNum = BigInt(`0x${intPart}`);
    else return null;

    // Convert Fractional part to decimal float (0.xxxx)
    let fracDecimal = 0;
    if (fracPartRaw) {
      for (let i = 0; i < fracPartRaw.length; i++) {
        const char = fracPartRaw[i];
        const val = fromBase === "hex" ? (HEX_VALUES[char] ?? 0) : parseInt(char, 10);
        fracDecimal += val * Math.pow(fromBaseNum, -(i + 1));
      }
    }

    const hasFraction = fracPartRaw.length > 0;
    const decimalNumeric = Number(bigNum) + fracDecimal;

    // Convert integer parts to string representations
    const intBin = bigNum.toString(2);
    const intOct = bigNum.toString(8);
    const intDec = bigNum.toString(10);
    const intHex = bigNum.toString(16).toUpperCase();

    // Convert fractional parts
    let fracBin = "";
    let fracOct = "";
    let fracDec = "";
    let fracHex = "";

    if (hasFraction) {
      fracBin = convertFractionFromDecimal(fracDecimal, 2).fractionResult;
      fracOct = convertFractionFromDecimal(fracDecimal, 8).fractionResult;
      fracHex = convertFractionFromDecimal(fracDecimal, 16).fractionResult;
      fracDec = fracPartRaw; // already decimal if fromBase was dec, or converted from float
      if (fromBase !== "dec") {
        const fracStr = fracDecimal.toString().split(".")[1] || "";
        fracDec = fracStr.slice(0, 8);
      }
    }

    const bin = hasFraction && fracBin ? `${intBin},${fracBin}` : intBin;
    const oct = hasFraction && fracOct ? `${intOct},${fracOct}` : intOct;
    const dec = hasFraction && fracDec ? `${intDec},${fracDec}` : intDec;
    const hex = hasFraction && fracHex ? `${intHex},${fracHex}` : intHex;

    const formattedBin = intBin.replace(/\B(?=(\d{4})+(?!\d))/g, " ") + (hasFraction && fracBin ? `,${fracBin}` : "");
    const formattedHex = (intHex.length % 2 !== 0 ? `0${intHex}` : intHex) + (hasFraction && fracHex ? `,${fracHex}` : "");
    const formattedDec = intDec.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (hasFraction && fracDec ? `,${fracDec}` : "");
    const formattedOct = oct;

    const bitLength = intBin.length;
    const byteSize = Math.ceil(bitLength / 8) || 1;

    return {
      bin,
      oct,
      dec,
      hex,
      bigIntValue: bigNum,
      hasFraction,
      decimalNumeric,
      formattedBin,
      formattedHex,
      formattedDec,
      formattedOct,
      bitLength,
      byteSize,
    };
  } catch {
    return null;
  }
}

// Convert directly from one base to another
export function convertBase(value: string, fromBase: BaseType, toBase: BaseType): string | null {
  const result = convertToAllBases(value, fromBase);
  return result ? result[toBase] : null;
}

// Superscript utility for math powers
export function toSuperscript(num: number): string {
  const superscripts: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻",
  };
  return num
    .toString()
    .split("")
    .map((digit) => superscripts[digit] || digit)
    .join("");
}

// Data models for the 2 calculation methods (Di Kali & Di Bagi)
export interface MultiplicationRow {
  digit: string;
  digitValue: number;
  power: number;
  powerValue: string;
  calculation: string;
  expanded: string;
  result: string;
  isFraction?: boolean;
}

export interface MultiplicationMethodData {
  title: string;
  baseNumber: number;
  rows: MultiplicationRow[];
  formulaLine1: string;
  formulaLine2: string;
  formulaLine3: string;
  totalDecimal: string;
}

export interface DivisionRow {
  step: number;
  dividend: string;
  quotient: string;
  remainder: number;
  remainderSymbol?: string;
  note?: string;
}

export interface FractionalMultiplicationRow {
  step: number;
  inputFraction: string;
  multiplier: number;
  multiplied: string;
  integerDigit: string;
  remainderFraction: string;
}

export interface DivisionMethodData {
  title: string;
  divisor: number;
  initialDecimalValue: string;
  rows: DivisionRow[];
  fractionalRows?: FractionalMultiplicationRow[];
  readingOrderText: string;
  finalResult: string;
}

export interface GroupingGroup {
  originalGroup: string;
  bits: string;
  mappedValue: string;
  explanation: string;
}

export interface GroupingMethodData {
  title: string;
  groupSize: number;
  direction: string;
  paddedInput: string;
  groups: GroupingGroup[];
  combinedResult: string;
}

export interface StepExplanation {
  title: string;
  fromBaseName: string;
  toBaseName: string;
  fromBase: BaseType;
  toBase: BaseType;
  inputClean: string;
  outputClean: string;
  decimalValue: string;
  hasFraction: boolean;
  
  // 1. Versi Di Kali (Multiplication / Powers)
  multiplicationData: MultiplicationMethodData;
  
  // 2. Versi Di Bagi (Division / Repeated Modulo & Fractional Multiply)
  divisionData: DivisionMethodData;
  
  // 3. Optional Grouping (Biner <-> Oktal / Hex)
  groupingData?: GroupingMethodData;
}

// Generate Dual Step-by-Step Explanations (Versi Di Kali & Versi Di Bagi)
export function generateConversionSteps(
  rawInput: string,
  fromBase: BaseType,
  toBase: BaseType
): StepExplanation | null {
  const cleanInput = sanitizeInput(rawInput, fromBase);
  if (!cleanInput) return null;
  if (!isValidBaseValue(cleanInput, fromBase)) return null;

  const allConverted = convertToAllBases(cleanInput, fromBase);
  if (!allConverted) return null;

  const outputResult = allConverted[toBase];
  const decValue = allConverted.dec;
  const fromBaseNum = BASE_CONFIGS[fromBase].base;
  const toBaseNum = BASE_CONFIGS[toBase].base;
  const hasFraction = allConverted.hasFraction;

  const [intPart = cleanInput, fracPart = ""] = cleanInput.split(".");

  // ==========================================
  // 1. VERSI DI KALI (METODE PERKALIAN / BOBOT PANGKAT)
  // ==========================================
  const multRows: MultiplicationRow[] = [];

  // Integer digits (powers 0, 1, 2, ...) from right to left
  const intDigits = intPart.split("").reverse();
  intDigits.forEach((char, index) => {
    const digitVal = fromBase === "hex" ? (HEX_VALUES[char.toUpperCase()] ?? 0) : parseInt(char, 10);
    const powerVal = BigInt(fromBaseNum) ** BigInt(index);
    const stepVal = BigInt(digitVal) * powerVal;
    multRows.push({
      digit: char,
      digitValue: digitVal,
      power: index,
      powerValue: powerVal.toString(),
      calculation: `(${char} × ${fromBaseNum}${toSuperscript(index)})`,
      expanded: `(${digitVal} × ${powerVal.toString()})`,
      result: stepVal.toString(),
      isFraction: false,
    });
  });

  const reversedMultRows = [...multRows].reverse();

  // Fractional digits (powers -1, -2, -3, ...) from left to right
  if (hasFraction && fracPart) {
    fracPart.split("").forEach((char, idx) => {
      const p = -(idx + 1);
      const digitVal = fromBase === "hex" ? (HEX_VALUES[char.toUpperCase()] ?? 0) : parseInt(char, 10);
      const powerFactor = Math.pow(fromBaseNum, p);
      const stepVal = digitVal * powerFactor;
      reversedMultRows.push({
        digit: char,
        digitValue: digitVal,
        power: p,
        powerValue: powerFactor < 1 ? powerFactor.toFixed(4).replace(/\.?0+$/, "") : String(powerFactor),
        calculation: `(${char} × ${fromBaseNum}${toSuperscript(p)})`,
        expanded: `(${digitVal} × ${powerFactor < 1 ? powerFactor.toFixed(4).replace(/\.?0+$/, "") : powerFactor})`,
        result: stepVal < 1 ? stepVal.toFixed(4).replace(/\.?0+$/, "") : String(stepVal),
        isFraction: true,
      });
    });
  }

  const formulaLine1 = reversedMultRows.map((r) => r.calculation).join(" + ") || `${cleanInput} × ${fromBaseNum}⁰`;
  const formulaLine2 = reversedMultRows.map((r) => r.expanded).join(" + ") || `${cleanInput} × 1`;
  const formulaLine3 = reversedMultRows.map((r) => r.result).join(" + ") || cleanInput;

  const multiplicationData: MultiplicationMethodData = {
    title: `Metode Perkalian (Bobot Pangkat Posisi Basis ${fromBaseNum})`,
    baseNumber: fromBaseNum,
    rows: reversedMultRows,
    formulaLine1,
    formulaLine2,
    formulaLine3,
    totalDecimal: decValue,
  };

  // ==========================================
  // 2. VERSI DI BAGI (METODE PEMBAGIAN BERULANG / MODULO)
  // ==========================================
  const divisor = toBaseNum;
  let num = allConverted.bigIntValue;
  const divRows: DivisionRow[] = [];
  let stepCounter = 1;

  if (num === 0n) {
    divRows.push({
      step: 1,
      dividend: "0",
      quotient: "0",
      remainder: 0,
      remainderSymbol: "0",
      note: "0 ÷ basis = 0 sisa 0",
    });
  } else {
    while (num > 0n) {
      const remainder = Number(num % BigInt(divisor));
      const quotient = num / BigInt(divisor);
      const remainderSymbol = toBase === "hex" ? VALUE_TO_HEX[remainder] : remainder.toString();
      const note =
        toBase === "hex" && remainder >= 10
          ? `Sisa ${remainder} dikonversi ke simbol huruf '${remainderSymbol}'`
          : undefined;

      divRows.push({
        step: stepCounter,
        dividend: num.toString(),
        quotient: quotient.toString(),
        remainder,
        remainderSymbol,
        note,
      });

      num = quotient;
      stepCounter++;
    }
  }

  // Fractional multiplication steps (if fractional input exists)
  let fractionalRows: FractionalMultiplicationRow[] | undefined = undefined;
  if (hasFraction && fracPart) {
    let fracDecimal = 0;
    for (let i = 0; i < fracPart.length; i++) {
      const char = fracPart[i];
      const val = fromBase === "hex" ? (HEX_VALUES[char] ?? 0) : parseInt(char, 10);
      fracDecimal += val * Math.pow(fromBaseNum, -(i + 1));
    }

    const fracSteps = convertFractionFromDecimal(fracDecimal, toBaseNum, 5);
    fractionalRows = fracSteps.steps.map((s) => ({
      step: s.step,
      inputFraction: s.input.toFixed(4).replace(/\.?0+$/, ""),
      multiplier: toBaseNum,
      multiplied: s.multiplied.toFixed(4).replace(/\.?0+$/, ""),
      integerDigit: s.digitSymbol,
      remainderFraction: s.nextFraction.toFixed(4).replace(/\.?0+$/, ""),
    }));
  }

  const divisionData: DivisionMethodData = {
    title: `Metode Pembagian (Pembagian Berulang / Modulo Basis ${divisor})`,
    divisor,
    initialDecimalValue: decValue,
    rows: divRows,
    fractionalRows,
    readingOrderText: `Baca sisa hasil bagi dari bawah ke atas: ${outputResult}`,
    finalResult: outputResult,
  };

  // ==========================================
  // 3. OPTIONAL GROUPING (FAST BIT MAPPING)
  // ==========================================
  let groupingData: GroupingMethodData | undefined = undefined;

  if (!hasFraction && fromBase === "bin" && toBase === "oct") {
    const rawLen = cleanInput.length;
    const padLen = (3 - (rawLen % 3)) % 3;
    const padded = "0".repeat(padLen) + cleanInput;
    const groups: GroupingGroup[] = [];

    for (let i = 0; i < padded.length; i += 3) {
      const chunk = padded.slice(i, i + 3);
      const val = parseInt(chunk, 2);
      groups.push({
        originalGroup: chunk,
        bits: chunk,
        mappedValue: val.toString(),
        explanation: `${chunk}₂ = (${chunk[0]}×4 + ${chunk[1]}×2 + ${chunk[2]}×1) = ${val}₈`,
      });
    }

    groupingData = {
      title: "Metode Pengelompokan 3 Bit (Cepat)",
      groupSize: 3,
      direction: "Kanan ke Kiri",
      paddedInput: padded,
      groups,
      combinedResult: outputResult,
    };
  } else if (!hasFraction && fromBase === "oct" && toBase === "bin") {
    const groups: GroupingGroup[] = cleanInput.split("").map((digit) => {
      const decVal = parseInt(digit, 10);
      const bits = decVal.toString(2).padStart(3, "0");
      return {
        originalGroup: digit,
        bits,
        mappedValue: bits,
        explanation: `${digit}₈ = ${bits}₂ (4×${bits[0]} + 2×${bits[1]} + 1×${bits[2]})`,
      };
    });

    groupingData = {
      title: "Metode Ekspansi 3 Bit per Digit",
      groupSize: 3,
      direction: "Kiri ke Kanan",
      paddedInput: cleanInput,
      groups,
      combinedResult: outputResult,
    };
  } else if (!hasFraction && fromBase === "bin" && toBase === "hex") {
    const rawLen = cleanInput.length;
    const padLen = (4 - (rawLen % 4)) % 4;
    const padded = "0".repeat(padLen) + cleanInput;
    const groups: GroupingGroup[] = [];

    for (let i = 0; i < padded.length; i += 4) {
      const chunk = padded.slice(i, i + 4);
      const decVal = parseInt(chunk, 2);
      const hexChar = VALUE_TO_HEX[decVal];
      const extra = decVal >= 10 ? ` (${decVal}₁₀ = '${hexChar}'₁₆)` : "";
      groups.push({
        originalGroup: chunk,
        bits: chunk,
        mappedValue: hexChar,
        explanation: `${chunk}₂ = ${decVal}${extra}`,
      });
    }

    groupingData = {
      title: "Metode Pengelompokan 4 Bit (Nibble)",
      groupSize: 4,
      direction: "Kanan ke Kiri",
      paddedInput: padded,
      groups,
      combinedResult: outputResult,
    };
  } else if (!hasFraction && fromBase === "hex" && toBase === "bin") {
    const groups: GroupingGroup[] = cleanInput.split("").map((digit) => {
      const hexChar = digit.toUpperCase();
      const decVal = HEX_VALUES[hexChar] ?? 0;
      const bits = decVal.toString(2).padStart(4, "0");
      const extra = decVal >= 10 ? ` (${decVal}₁₀)` : "";
      return {
        originalGroup: hexChar,
        bits,
        mappedValue: bits,
        explanation: `${hexChar}₁₆${extra} = ${bits}₂`,
      };
    });

    groupingData = {
      title: "Metode Ekspansi 4 Bit (Nibble)",
      groupSize: 4,
      direction: "Kiri ke Kanan",
      paddedInput: cleanInput,
      groups,
      combinedResult: outputResult,
    };
  }

  return {
    title: `Konversi ${BASE_CONFIGS[fromBase].name} ke ${BASE_CONFIGS[toBase].name}`,
    fromBaseName: BASE_CONFIGS[fromBase].name,
    toBaseName: BASE_CONFIGS[toBase].name,
    fromBase,
    toBase,
    inputClean: cleanInput.replace(/\./g, ","),
    outputClean: outputResult,
    decimalValue: decValue,
    hasFraction,
    multiplicationData,
    divisionData,
    groupingData,
  };
}

// IP Converter Helpers (All Bases for IP Addresses)
export interface IPOctetBreakdown {
  octetIndex: number;
  decimal: number;
  binary: string;
  octal: string;
  hex: string;
}

export interface IPAllBasesResult {
  dottedDecimal: string;
  dottedBinary: string;
  dottedOctal: string;
  dottedHex: string;
  fullBinary: string;
  fullHex: string;
  integerDecimal: string;
  octets: IPOctetBreakdown[];
}

export function convertIPToAllBases(ip: string): IPAllBasesResult | null {
  const clean = ip.trim();
  if (!clean) return null;

  // Check if input is standard dotted-decimal
  const parts = clean.split(".");
  if (parts.length === 4) {
    const nums = parts.map(Number);
    if (nums.every((n, i) => !isNaN(n) && n >= 0 && n <= 255 && String(n) === parts[i])) {
      const octets: IPOctetBreakdown[] = nums.map((n, i) => ({
        octetIndex: i + 1,
        decimal: n,
        binary: n.toString(2).padStart(8, "0"),
        octal: n.toString(8).padStart(3, "0"),
        hex: n.toString(16).toUpperCase().padStart(2, "0"),
      }));

      const dottedDecimal = nums.join(".");
      const dottedBinary = octets.map((o) => o.binary).join(".");
      const dottedOctal = octets.map((o) => `0${o.octal}`).join(".");
      const dottedHex = octets.map((o) => `0x${o.hex}`).join(".");
      const fullBinary = octets.map((o) => o.binary).join("");
      const fullHex = `0x${octets.map((o) => o.hex).join("")}`;
      const intNum = ((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0;

      return {
        dottedDecimal,
        dottedBinary,
        dottedOctal,
        dottedHex,
        fullBinary,
        fullHex,
        integerDecimal: intNum.toString(),
        octets,
      };
    }
  }

  // Check if input is 32-bit Integer (DWORD)
  if (/^\d+$/.test(clean)) {
    try {
      const num = BigInt(clean);
      if (num >= 0n && num <= 4294967295n) {
        const n = Number(num);
        const oct1 = (n >>> 24) & 0xff;
        const oct2 = (n >>> 16) & 0xff;
        const oct3 = (n >>> 8) & 0xff;
        const oct4 = n & 0xff;
        return convertIPToAllBases(`${oct1}.${oct2}.${oct3}.${oct4}`);
      }
    } catch {
      return null;
    }
  }

  // Check if input is 32-bit Hex (e.g. 0xC0A80101 or C0A80101)
  let hexClean = clean;
  if (hexClean.startsWith("0x") || hexClean.startsWith("0X")) hexClean = hexClean.slice(2);
  if (/^[0-9A-Fa-f]{8}$/.test(hexClean)) {
    const n = parseInt(hexClean, 16);
    const oct1 = (n >>> 24) & 0xff;
    const oct2 = (n >>> 16) & 0xff;
    const oct3 = (n >>> 8) & 0xff;
    const oct4 = n & 0xff;
    return convertIPToAllBases(`${oct1}.${oct2}.${oct3}.${oct4}`);
  }

  return null;
}

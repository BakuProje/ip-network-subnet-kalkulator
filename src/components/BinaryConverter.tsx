import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Shuffle,
  RotateCcw,
  Copy,
  Check,
  Calculator,
} from "lucide-react";
import {
  BaseType,
  BASE_CONFIGS,
  convertToAllBases,
  generateConversionSteps,
  sanitizeInput,
  isValidBaseValue,
  StepExplanation,
} from "@/lib/numberSystems";

const BASES: BaseType[] = ["bin", "oct", "dec", "hex"];

const BinaryConverter = () => {
  const [pairFrom, setPairFrom] = useState<BaseType>("dec");
  const [pairTo, setPairTo] = useState<BaseType>("bin");
  const [pairInput, setPairInput] = useState<string>("255");
  const [pairResult, setPairResult] = useState<string | null>("11111111");
  const [stepsExplanation, setStepsExplanation] = useState<StepExplanation | null>(null);
  const [activeMethodTab, setActiveMethodTab] = useState<"multiply" | "divide" | "grouping">("multiply");
  const [showSteps, setShowSteps] = useState(true);
  const [copied, setCopied] = useState(false);

  // Step-by-step calculation trigger
  useEffect(() => {
    if (!pairInput.trim()) {
      setPairResult(null);
      setStepsExplanation(null);
      return;
    }

    const clean = sanitizeInput(pairInput, pairFrom);
    if (!isValidBaseValue(clean, pairFrom)) {
      setPairResult(null);
      setStepsExplanation(null);
      return;
    }

    const converted = convertToAllBases(clean, pairFrom);
    if (converted) {
      setPairResult(converted[pairTo]);
      const steps = generateConversionSteps(clean, pairFrom, pairTo);
      setStepsExplanation(steps);
    } else {
      setPairResult(null);
      setStepsExplanation(null);
    }
  }, [pairInput, pairFrom, pairTo]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomNumber = () => {
    const randomDec = Math.floor(Math.random() * 65535) + 1;
    if (pairFrom === "dec") {
      setPairInput(randomDec.toString());
    } else if (pairFrom === "bin") {
      setPairInput(randomDec.toString(2));
    } else if (pairFrom === "oct") {
      setPairInput(randomDec.toString(8));
    } else if (pairFrom === "hex") {
      setPairInput(randomDec.toString(16).toUpperCase());
    }
  };

  const handleReset = () => {
    setPairInput("");
    setPairResult(null);
    setStepsExplanation(null);
  };

  return (
    <div className="neo-box bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 md:p-6 border-b-2 border-slate-900 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-white shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              Konversi Sistem Bilangan &amp; Cara Kerja
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Konversi otomatis Biner, Oktal, Desimal, dan Heksadesimal (mendukung koma / pecahan)
            </p>
          </div>
        </div>

        {/* Action Buttons (Acak & Reset) */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleRandomNumber}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 neo-btn-sm"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Acak
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-300 neo-btn-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-6">
        {/* Pair Selector Controls */}
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-900 bg-slate-50 shadow-[3px_3px_0px_0px_#0f172a] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From Base */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">
                Konversi Dari:
              </label>
              <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white rounded-xl border-2 border-slate-900">
                {BASES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setPairFrom(b)}
                    className={`py-2 px-0.5 sm:px-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all text-center truncate ${pairFrom === b
                      ? "bg-blue-600 text-white border border-slate-900 shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    {BASE_CONFIGS[b].name}
                  </button>
                ))}
              </div>
            </div>

            {/* To Base */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">
                Dikonversi Ke:
              </label>
              <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white rounded-xl border-2 border-slate-900">
                {BASES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setPairTo(b)}
                    className={`py-2 px-0.5 sm:px-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all text-center truncate ${pairTo === b
                      ? "bg-emerald-600 text-white border border-slate-900 shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    {BASE_CONFIGS[b].name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input and Result Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Input {BASE_CONFIGS[pairFrom].name} (Basis {BASE_CONFIGS[pairFrom].base}):
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {BASE_CONFIGS[pairFrom].description}
                </span>
              </div>
              <input
                type="text"
                value={pairInput}
                onChange={(e) => setPairInput(e.target.value)}
                placeholder={BASE_CONFIGS[pairFrom].placeholder}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Hasil {BASE_CONFIGS[pairTo].name} (Basis {BASE_CONFIGS[pairTo].base}):
                </label>
                {pairResult && (
                  <button
                    onClick={() => copyToClipboard(pairResult)}
                    className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Hasil
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full min-h-[42px] bg-emerald-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 font-mono text-base font-black text-emerald-900 flex items-center break-all shadow-inner">
                {pairResult !== null ? (
                  pairResult
                ) : (
                  <span className="text-slate-400 text-sm font-normal">Menunggu input yang valid...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP BY STEP BREAKDOWN (CLEAN, NO REDUNDANT BANNERS) */}
        {/* ======================================================== */}
        {stepsExplanation && (
          <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-[3px_3px_0px_0px_#0f172a]">
            {/* Header Accordion Bar */}
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b-2 border-slate-900 text-left"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {stepsExplanation.title} — CARA KERJA
                  </p>
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold">
                    2 Versi
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Pilihan metode perhitungan: <strong>Versi Kali</strong> &amp; <strong>Versi Bagi</strong>
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-800 transition-transform duration-200 ${showSteps ? "rotate-180" : ""
                  }`}
              />
            </button>

            <AnimatePresence>
              {showSteps && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 space-y-5 text-xs">
                    {/* Clean Method Tabs Selector (No extra icons/emojis) */}
                    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl border-2 border-slate-900">
                      {/* Tab 1: Versi Di Kali */}
                      <button
                        onClick={() => setActiveMethodTab("multiply")}
                        className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${activeMethodTab === "multiply"
                          ? "bg-blue-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                          : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                          }`}
                      >
                        Versi Kali
                      </button>

                      {/* Tab 2: Versi Di Bagi */}
                      <button
                        onClick={() => setActiveMethodTab("divide")}
                        className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${activeMethodTab === "divide"
                          ? "bg-emerald-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                          : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                          }`}
                      >
                        Versi Bagi
                      </button>

                      {/* Tab 3: Pengelompokan Bit (if applicable) */}
                      {stepsExplanation.groupingData && (
                        <button
                          onClick={() => setActiveMethodTab("grouping")}
                          className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${activeMethodTab === "grouping"
                            ? "bg-purple-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                            : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                            }`}
                        >
                          Pengelompokan Bit
                        </button>
                      )}
                    </div>

                    {/* ======================================================== */}
                    {/* TAB CONTENT 1: VERSI DI KALI (PERKALIAN & PANGKAT) */}
                    {/* ======================================================== */}
                    {activeMethodTab === "multiply" && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Table of Positional Multiplications */}
                        <div className="space-y-2">
                          <p className="font-bold text-slate-900">
                            Tabel Penjabaran Perkalian Bobot Posisi ({stepsExplanation.multiplicationData.baseNumber}ⁿ):
                          </p>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden">
                              <thead className="bg-slate-100 text-[11px] text-slate-800 border-b-2 border-slate-900 font-bold">
                                <tr>
                                  <th className="p-2.5">Digit Asal</th>
                                  <th className="p-2.5">Nilai Digit</th>
                                  <th className="p-2.5">Posisi (Pangkat)</th>
                                  <th className="p-2.5">Faktor ({stepsExplanation.multiplicationData.baseNumber}ⁿ)</th>
                                  <th className="p-2.5">Operasi Perkalian</th>
                                  <th className="p-2.5 text-right">Hasil Desimal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y border-slate-200 text-xs">
                                {stepsExplanation.multiplicationData.rows.map((r, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-blue-700">{r.digit}</td>
                                    <td className="p-2.5 text-slate-900">{r.digitValue}</td>
                                    <td className="p-2.5 text-slate-500">{r.power}</td>
                                    <td className="p-2.5 text-purple-700 font-bold">{r.powerValue}</td>
                                    <td className="p-2.5 text-slate-600">{r.expanded}</td>
                                    <td className="p-2.5 font-black text-emerald-700 text-right">
                                      {r.result}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Summary Formulas */}
                        <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 font-mono space-y-2.5 overflow-x-auto text-xs shadow-2xs">
                          <div className="text-slate-500 font-bold">Persamaan Perkalian Lengkap:</div>
                          <div className="text-slate-800 break-words whitespace-normal leading-relaxed font-medium">
                            <span className="text-blue-700 font-bold mr-1">=</span>
                            {stepsExplanation.multiplicationData.formulaLine1}
                          </div>
                          <div className="text-slate-800 break-words whitespace-normal leading-relaxed font-medium">
                            <span className="text-blue-700 font-bold mr-1">=</span>
                            {stepsExplanation.multiplicationData.formulaLine2}
                          </div>
                          <div className="text-purple-700 break-words whitespace-normal leading-relaxed font-bold">
                            <span className="text-purple-700 font-bold mr-1">=</span>
                            {stepsExplanation.multiplicationData.formulaLine3}
                          </div>
                          <div className="pt-2 border-t-2 border-slate-300 flex flex-wrap items-center justify-between gap-2 text-sm font-black text-slate-900">
                            <span>
                              Total Desimal = <span className="text-blue-700">{stepsExplanation.multiplicationData.totalDecimal}₁₀</span>
                            </span>
                            <span className="text-emerald-700">
                              Hasil Akhir ({stepsExplanation.toBaseName}) = {stepsExplanation.outputClean}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB CONTENT 2: VERSI DI BAGI (PEMBAGIAN BERULANG / MODULO) */}
                    {/* ======================================================== */}
                    {activeMethodTab === "divide" && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Table of Repeated Divisions */}
                        <div className="space-y-2">
                          <p className="font-bold text-slate-900">
                            Tabel Pembagian Berulang (Nilai ÷ {stepsExplanation.divisionData.divisor}):
                          </p>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden">
                              <thead className="bg-slate-100 text-[11px] text-slate-800 border-b-2 border-slate-900 font-bold">
                                <tr>
                                  <th className="p-2.5">Langkah</th>
                                  <th className="p-2.5">Operasi Pembagian</th>
                                  <th className="p-2.5">Hasil Bagi (Quotient)</th>
                                  <th className="p-2.5 text-right">Sisa Bagi (Remainder)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y border-slate-200 text-xs">
                                {stepsExplanation.divisionData.rows.map((row) => (
                                  <tr key={row.step} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-500">Langkah {row.step}</td>
                                    <td className="p-2.5 text-slate-900 font-bold">
                                      {row.dividend} ÷ {stepsExplanation.divisionData.divisor}
                                    </td>
                                    <td className="p-2.5 text-blue-700 font-bold">{row.quotient}</td>
                                    <td className="p-2.5 text-right font-black text-emerald-700">
                                      sisa {row.remainder}
                                      {row.remainderSymbol && row.remainderSymbol !== String(row.remainder) && (
                                        <span className="text-amber-700 ml-1.5 px-1.5 py-0.5 bg-amber-100 rounded border border-amber-300">
                                          '{row.remainderSymbol}'
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Fractional multiplication steps if input has fraction */}
                        {stepsExplanation.divisionData.fractionalRows && stepsExplanation.divisionData.fractionalRows.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <p className="font-bold text-slate-900">
                              Tabel Perkalian Pecahan (Pecahan × {stepsExplanation.divisionData.divisor}):
                            </p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden">
                                <thead className="bg-slate-100 text-[11px] text-slate-800 border-b-2 border-slate-900 font-bold">
                                  <tr>
                                    <th className="p-2.5">Langkah</th>
                                    <th className="p-2.5">Operasi Pecahan</th>
                                    <th className="p-2.5">Hasil Perkalian</th>
                                    <th className="p-2.5">Digit Diambil</th>
                                    <th className="p-2.5 text-right">Sisa Pecahan</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y border-slate-200 text-xs">
                                  {stepsExplanation.divisionData.fractionalRows.map((frow) => (
                                    <tr key={frow.step} className="hover:bg-slate-50">
                                      <td className="p-2.5 font-bold text-slate-500">Langkah {frow.step}</td>
                                      <td className="p-2.5 text-slate-900 font-bold">
                                        0.{frow.inputFraction} × {frow.multiplier}
                                      </td>
                                      <td className="p-2.5 text-blue-700 font-bold">{frow.multiplied}</td>
                                      <td className="p-2.5 font-black text-purple-700">'{frow.integerDigit}'</td>
                                      <td className="p-2.5 text-right font-mono text-slate-600">0.{frow.remainderFraction}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Clean Result Footer (Without circular icon) */}
                        <div className="p-4 rounded-xl bg-emerald-50 border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <p className="text-emerald-950 font-bold text-xs">
                            {stepsExplanation.divisionData.readingOrderText}
                          </p>
                          <div className="px-3 py-1.5 rounded-lg bg-white border-2 border-slate-900 font-mono font-black text-emerald-900 text-sm text-center">
                            Hasil Akhir: {stepsExplanation.divisionData.finalResult}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB CONTENT 3: METODE PENGELOMPOKAN BIT */}
                    {/* ======================================================== */}
                    {activeMethodTab === "grouping" && stepsExplanation.groupingData && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Cards for each group */}
                        {stepsExplanation.groupingData.groups.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {stepsExplanation.groupingData.groups.map((grp, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-xl border-2 border-slate-900 bg-slate-50 text-center space-y-1 shadow-[2px_2px_0px_0px_#0f172a]"
                              >
                                <span className="text-[10px] text-slate-500 font-bold block">
                                  Grup {i + 1}
                                </span>
                                <div className="font-mono font-bold text-blue-700 text-sm bg-white py-1 px-2 rounded-lg border border-slate-300">
                                  {grp.bits}
                                </div>
                                <div className="text-slate-400 text-[10px]">↓</div>
                                <div className="font-mono font-black text-purple-700 text-base">
                                  {grp.mappedValue}
                                </div>
                                <p className="text-[10px] text-slate-600 font-mono">
                                  {grp.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 font-mono text-xs">
                            Biner Perantara: <strong>{stepsExplanation.groupingData.paddedInput}₂</strong>
                          </div>
                        )}

                        <div className="p-3.5 rounded-xl bg-purple-50 border-2 border-purple-300 flex items-center justify-between">
                          <span className="text-purple-900 font-bold">Gabungan Seluruh Digit:</span>
                          <span className="font-mono font-black text-purple-950 text-base">
                            {stepsExplanation.groupingData.combinedResult}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryConverter;

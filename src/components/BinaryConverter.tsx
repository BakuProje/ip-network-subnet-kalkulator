import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Check,
  Calculator,
  Layers,
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

const BASES: BaseType[] = ["dec", "bin", "oct", "hex"];

const QUICK_CONVERSIONS: Array<{
  id: string;
  from: BaseType;
  to: BaseType;
  label: string;
  sublabel: string;
  example: string;
}> = [
    { id: "dec-bin", from: "dec", to: "bin", label: "Desimal → Biner", sublabel: "dibagi-bagi 2", example: "1291" },
    { id: "dec-oct", from: "dec", to: "oct", label: "Desimal → Oktal", sublabel: "dibagi-bagi 8", example: "1291" },
    { id: "dec-hex", from: "dec", to: "hex", label: "Desimal → Heksadesimal", sublabel: "dibagi-bagi 16", example: "1291" },
    { id: "bin-dec", from: "bin", to: "dec", label: "Biner → Desimal", sublabel: "dikali-kali 2", example: "10100001011" },
    { id: "bin-oct", from: "bin", to: "oct", label: "Biner → Oktal", sublabel: "dikelompokkan 3 bit (4-2-1)", example: "10100001011" },
    { id: "bin-hex", from: "bin", to: "hex", label: "Biner → Heksadesimal", sublabel: "dikelompokkan 4 bit (8-4-2-1)", example: "10100001011" },
    { id: "oct-dec", from: "oct", to: "dec", label: "Oktal → Desimal", sublabel: "dikali-kali 8", example: "2413" },
    { id: "oct-bin", from: "oct", to: "bin", label: "Oktal → Biner", sublabel: "diuraikan 3 bit (4-2-1)", example: "2413" },
    { id: "oct-hex", from: "oct", to: "hex", label: "Oktal → Heksadesimal", sublabel: "oktal → biner → heksadesimal", example: "2413" },
    { id: "hex-dec", from: "hex", to: "dec", label: "Heksadesimal → Desimal", sublabel: "dikali-kali 16", example: "50B" },
    { id: "hex-bin", from: "hex", to: "bin", label: "Heksadesimal → Biner", sublabel: "diuraikan 4 bit (8-4-2-1)", example: "50B" },
    { id: "hex-oct", from: "hex", to: "oct", label: "Heksadesimal → Oktal", sublabel: "heksadesimal → biner → oktal", example: "50B" },
  ];

const BinaryConverter = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pairFrom, setPairFrom] = useState<BaseType>("dec");
  const [pairTo, setPairTo] = useState<BaseType>("bin");
  const [pairInput, setPairInput] = useState<string>("1291");
  const [pairResult, setPairResult] = useState<string | null>("10100001011");
  const [stepsExplanation, setStepsExplanation] = useState<StepExplanation | null>(null);
  const [activeMethodTab, setActiveMethodTab] = useState<"slide" | "multiply" | "divide" | "grouping">("slide");
  const [showSteps, setShowSteps] = useState(true);
  const [copied, setCopied] = useState(false);

  // Step-by-Step calculation trigger
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

  const handleSelectConversion = (item: typeof QUICK_CONVERSIONS[0]) => {
    setPairFrom(item.from);
    setPairTo(item.to);
    setPairInput(item.example);
  };

  // Render Multi-Step Grouping / Two-Stage Breakdown Component
  const renderGroupingSection = () => {
    if (!stepsExplanation?.groupingData) return null;
    const { groupingData } = stepsExplanation;

    if (groupingData.isTwoStage) {
      return (
        <div className="space-y-4">
          {/* TAHAP 1 CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-2 border-slate-900 space-y-3.5 shadow-[3px_3px_0px_0px_#0f172a]">
            {/* Header Tahap 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-300 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] shrink-0">
                  TAHAP 1
                </span>
                <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                  {groupingData.stage1Title?.replace(/^Tahap 1:\s*/i, "") || "Uraikan Setiap Digit Menjadi Bit Biner"}
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold bg-white text-blue-900 px-2.5 py-0.5 rounded-lg border border-slate-300 self-start sm:self-auto shadow-2xs">
                {stepsExplanation.fromBase === "hex" ? "4 Bit (Bobot 8, 4, 2, 1)" : "3 Bit (Bobot 4, 2, 1)"}
              </span>
            </div>

            {/* Cards Grid Tahap 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {groupingData.stage1Groups?.map((grp, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border-2 border-slate-900 rounded-xl text-center space-y-1.5 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[-1px] transition-transform"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                      Digit '{grp.originalGroup}'
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 font-bold bg-blue-50/80 py-0.5 px-1 rounded border border-blue-100">
                    Bobot: {grp.subWeights}
                  </div>
                  <div className="text-slate-400 text-xs font-bold leading-none">↓</div>
                  <div className="font-mono font-black text-blue-700 text-base bg-blue-50/50 py-1 rounded-lg border border-blue-200">
                    {grp.bits}
                    <sub className="text-[10px] text-blue-500 ml-0.5 font-bold">2</sub>
                  </div>
                </div>
              ))}
            </div>

            {/* Hasil Biner Sementara Tahap 1 */}
            <div className="p-3 bg-white border-2 border-slate-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <span className="text-xs font-bold text-slate-800">
                Gabungan Biner Perantara (Hasil Tahap 1):
              </span>
              <div className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-300 break-all shadow-inner">
                {groupingData.intermediateBinary}
                <sub className="text-[10px] text-blue-500 ml-0.5 font-bold">2</sub>
              </div>
            </div>
          </div>

          {/* Transition Bridge Indicator */}
          <div className="flex items-center justify-center py-0.5">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full font-black text-xs shadow-[2px_2px_0px_0px_#0f172a]">
              <span>Lanjut ke Tahap 2</span>
            </div>
          </div>

          {/* TAHAP 2 CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-2 border-slate-900 space-y-3.5 shadow-[3px_3px_0px_0px_#0f172a]">
            {/* Header Tahap 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-300 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] shrink-0">
                  TAHAP 2
                </span>
                <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                  {groupingData.stage2Title?.replace(/^Tahap 2:\s*/i, "") || "Kelompokkan Biner Hasil Tahap 1"}
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold bg-white text-emerald-900 px-2.5 py-0.5 rounded-lg border border-slate-300 self-start sm:self-auto shadow-2xs">
                {stepsExplanation.toBase === "hex" ? "4 Bit dari Kanan (Bobot 8, 4, 2, 1)" : "3 Bit dari Kanan (Bobot 4, 2, 1)"}
              </span>
            </div>

            {/* Cards Grid Tahap 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {groupingData.stage2Groups?.map((grp, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border-2 border-slate-900 rounded-xl text-center space-y-1.5 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[-1px] transition-transform"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                      Grup {i + 1}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-xs bg-slate-100 py-1 px-2 rounded-lg border border-slate-300">
                    {grp.bits}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 font-bold bg-emerald-50/80 py-0.5 px-1 rounded border border-emerald-100">
                    Bobot: {grp.subWeights}
                  </div>
                  <div className="text-slate-400 text-xs font-bold leading-none">↓</div>
                  <div className="font-mono font-black text-emerald-700 text-lg bg-emerald-50/50 py-0.5 rounded-lg border border-emerald-200">
                    {grp.mappedValue}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Result Tahap 2 */}
            <div className="p-3.5 bg-white border-2 border-slate-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs font-mono">
              <span className="font-bold text-xs text-slate-800">
                Hasil Akhir ({BASE_CONFIGS[stepsExplanation.toBase].name}):
              </span>
              <div className="font-black text-sm sm:text-base text-emerald-900 bg-emerald-50 px-3.5 py-1.5 rounded-lg border-2 border-emerald-800 shadow-xs self-start sm:self-auto">
                {stepsExplanation.outputClean}
                <sub className="text-xs font-bold text-emerald-700 ml-1">
                  {BASE_CONFIGS[stepsExplanation.toBase].base}
                </sub>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Single-Stage Grouping (bin-oct, bin-hex, oct-bin, hex-bin)
    return (
      <div className="space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border-2 border-slate-900 space-y-3.5 shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-300 pb-3">
            <h4 className="font-black text-slate-900 text-xs sm:text-sm">
              {groupingData.title}
            </h4>
            <span className="text-[11px] font-mono font-bold bg-white text-purple-900 px-2.5 py-0.5 rounded-lg border border-slate-300 self-start sm:self-auto shadow-2xs">
              {groupingData.direction}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {groupingData.groups.map((grp, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border-2 border-slate-900 bg-white text-center space-y-1.5 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[-1px] transition-transform"
              >
                <div className="flex items-center justify-center">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                    Grup {i + 1}
                  </span>
                </div>
                <div className="font-mono font-bold text-blue-700 text-xs sm:text-sm bg-blue-50 py-1 px-2 rounded-lg border border-blue-200">
                  {grp.bits}
                </div>
                {grp.subWeights && (
                  <div className="text-[10px] text-slate-500 font-mono font-bold bg-purple-50/80 py-0.5 px-1 rounded border border-purple-100">
                    Bobot: {grp.subWeights}
                  </div>
                )}
                <div className="text-slate-400 text-xs font-bold leading-none">↓</div>
                <div className="font-mono font-black text-purple-700 text-lg bg-purple-50/50 py-0.5 rounded-lg border border-purple-200">
                  {grp.mappedValue}
                </div>
                <p className="text-[10px] text-slate-600 font-mono line-clamp-2">
                  {grp.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-white border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
            <span className="text-slate-900 font-bold text-xs">Gabungan Seluruh Digit:</span>
            <div className="font-mono font-black text-purple-950 text-sm sm:text-base bg-purple-50 px-3.5 py-1.5 rounded-lg border-2 border-purple-800 shadow-xs self-start sm:self-auto">
              {groupingData.combinedResult}
              <sub className="text-xs font-bold text-purple-700 ml-1">
                {BASE_CONFIGS[stepsExplanation.toBase].base}
              </sub>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="neo-box bg-white overflow-hidden space-y-0">
      {/* Collapsible Header Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors border-b-2 border-slate-900 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-white shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Kalkulator Konversi
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Konversi otomatis 12 metode sistem bilangan desimal, biner, oktal, heksadesimal &amp; langkah lengkap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-5 h-5 text-slate-900 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {/* Collapsible Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 md:p-6 space-y-6">
              {/* Quick Menu: 12 Metode Konversi */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    PILIH 12 METODE KONVERSI:
                  </label>
                  <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                    Klik salah satu opsi di bawah untuk memilih
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {QUICK_CONVERSIONS.map((item) => {
                    const isSelected = pairFrom === item.from && pairTo === item.to;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectConversion(item)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${isSelected
                          ? "bg-purple-50 border-purple-900 shadow-[2px_2px_0px_0px_#581c87]"
                          : "bg-white border-slate-900 hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#0f172a]"
                          }`}
                      >
                        <span className="text-[11px] font-black text-slate-900 truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium line-clamp-1">
                          {item.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Custom Pair Selector Controls */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-900 bg-slate-50 shadow-[3px_3px_0px_0px_#0f172a] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* From Base: 2 columns on mobile, 4 columns on desktop */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Konversi Dari (Basis Asal):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border-2 border-slate-900">
                      {BASES.map((b) => (
                        <button
                          key={b}
                          onClick={() => setPairFrom(b)}
                          className={`py-2 px-2 text-xs font-black rounded-lg transition-all text-center ${pairFrom === b
                            ? "bg-blue-600 text-white border border-slate-900 shadow-xs"
                            : "text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          {BASE_CONFIGS[b].name} ({BASE_CONFIGS[b].base})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* To Base: 2 columns on mobile, 4 columns on desktop */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Dikonversi Ke (Basis Tujuan):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border-2 border-slate-900">
                      {BASES.map((b) => (
                        <button
                          key={b}
                          onClick={() => setPairTo(b)}
                          className={`py-2 px-2 text-xs font-black rounded-lg transition-all text-center ${pairTo === b
                            ? "bg-emerald-600 text-white border border-slate-900 shadow-xs"
                            : "text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          {BASE_CONFIGS[b].name} ({BASE_CONFIGS[b].base})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input and Result Box - 2 Lines on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="text-xs font-bold text-slate-800">
                        Hasil {BASE_CONFIGS[pairTo].name} (Basis {BASE_CONFIGS[pairTo].base}):
                      </label>
                      {pairResult && (
                        <button
                          onClick={() => copyToClipboard(pairResult)}
                          className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-bold self-start sm:self-auto"
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
                        <span>
                          {pairResult}
                          <sub className="text-xs font-bold text-emerald-700 ml-1">
                            {BASE_CONFIGS[pairTo].base}
                          </sub>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm font-normal">Menunggu input yang valid...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Breakdown Accordion */}
              {stepsExplanation && (
                <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-[3px_3px_0px_0px_#0f172a]">
                  {/* Header Accordion Bar */}
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50 hover:bg-slate-100 transition-colors border-b-2 border-slate-900 text-left"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                          {stepsExplanation.slideMethod.title || stepsExplanation.title} — CARA KERJA
                        </p>
                        <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-mono text-[10px] font-bold">
                          {stepsExplanation.slideMethod.subtitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Metode: <strong className="text-slate-900">{stepsExplanation.slideMethod.title}</strong> ({stepsExplanation.slideMethod.subtitle})
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-800 transition-transform duration-200 shrink-0 ${showSteps ? "rotate-180" : ""
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
                        <div className="p-4 sm:p-5 space-y-5 text-xs">
                          {/* Method Tabs Selector - 2 columns on mobile */}
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-xl border-2 border-slate-900">
                            {/* Tab 1: Metode Utama */}
                            <button
                              onClick={() => setActiveMethodTab("slide")}
                              className={`w-full sm:w-auto px-3.5 py-2 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 ${activeMethodTab === "slide"
                                ? "bg-purple-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                                : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                                }`}
                            >
                              <span>Utama</span>
                            </button>

                            {/* Tab 2: Versi Di Kali */}
                            <button
                              onClick={() => setActiveMethodTab("multiply")}
                              className={`w-full sm:w-auto px-3.5 py-2 rounded-lg font-black text-xs transition-all flex items-center justify-center ${activeMethodTab === "multiply"
                                ? "bg-blue-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                                : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                                }`}
                            >
                              Versi Kali
                            </button>

                            {/* Tab 3: Versi Di Bagi */}
                            <button
                              onClick={() => setActiveMethodTab("divide")}
                              className={`w-full sm:w-auto px-3.5 py-2 rounded-lg font-black text-xs transition-all flex items-center justify-center ${activeMethodTab === "divide"
                                ? "bg-emerald-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                                : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                                }`}
                            >
                              Versi Bagi
                            </button>

                            {/* Tab 4: Pengelompokan Bit */}
                            {stepsExplanation.groupingData && (
                              <button
                                onClick={() => setActiveMethodTab("grouping")}
                                className={`w-full sm:w-auto px-3.5 py-2 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 ${activeMethodTab === "grouping"
                                  ? "bg-amber-500 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                                  : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-300"
                                  }`}
                              >
                                <Layers className="w-3.5 h-3.5 shrink-0" />
                                <span>Pengelompokan Bit</span>
                              </button>
                            )}
                          </div>

                          {/* ======================================================== */}
                          {/* TAB CONTENT 1: METODE UTAMA */}
                          {/* ======================================================== */}
                          {activeMethodTab === "slide" && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50 border-2 border-purple-900 shadow-[2px_2px_0px_0px_#581c87] space-y-1.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                  <span className="font-black text-purple-950 text-sm">
                                    {stepsExplanation.slideMethod.title}
                                  </span>
                                  <span className="font-bold text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded border border-purple-400 self-start sm:self-auto">
                                    {stepsExplanation.slideMethod.subtitle}
                                  </span>
                                </div>
                                <p className="text-xs text-purple-900 font-mono break-all">
                                  {stepsExplanation.inputClean}
                                  <sub>{BASE_CONFIGS[stepsExplanation.fromBase].base}</sub> ={" "}
                                  <strong className="text-purple-950">{stepsExplanation.outputClean}</strong>
                                  <sub>{BASE_CONFIGS[stepsExplanation.toBase].base}</sub>
                                </p>
                              </div>

                              {/* Case 1: Division */}
                              {stepsExplanation.fromBase === "dec" && (
                                <div className="space-y-3">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden min-w-[320px]">
                                      <thead className="bg-slate-100 text-[11px] text-slate-800 border-b-2 border-slate-900 font-bold">
                                        <tr>
                                          <th className="p-2.5">Basis</th>
                                          <th className="p-2.5">Nilai Operasi</th>
                                          <th className="p-2.5">Hasil Bagi</th>
                                          <th className="p-2.5 text-right">Sisa (Remainder)</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y border-slate-200 text-xs">
                                        {stepsExplanation.divisionData.rows.map((row, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-purple-700">
                                              {stepsExplanation.divisionData.divisor}
                                            </td>
                                            <td className="p-2.5 font-bold text-slate-900">
                                              {row.dividend} ÷ {stepsExplanation.divisionData.divisor}
                                            </td>
                                            <td className="p-2.5 text-blue-700 font-bold">{row.quotient}</td>
                                            <td className="p-2.5 text-right font-black text-emerald-700">
                                              sisa {row.remainder}
                                              {row.remainderSymbol && row.remainderSymbol !== String(row.remainder) && (
                                                <span className="text-amber-800 ml-1.5 px-1.5 py-0.5 bg-amber-100 rounded border border-amber-300 font-bold">
                                                  = '{row.remainderSymbol}'
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Result footer - Responsive 2-column or stacked */}
                                  <div className="p-3.5 bg-emerald-50 border-2 border-slate-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                    <div className="flex items-start sm:items-center gap-2 font-bold text-emerald-950 text-xs leading-snug">
                                      <span className="text-base shrink-0">⬆️</span>
                                      <span className="break-words">{stepsExplanation.divisionData.readingOrderText}</span>
                                    </div>
                                    <div className="font-mono font-black text-emerald-900 text-sm px-3 py-1.5 bg-white rounded-lg border-2 border-slate-900 shrink-0 self-start sm:self-auto shadow-xs">
                                      {stepsExplanation.outputClean}
                                      <sub>{BASE_CONFIGS[stepsExplanation.toBase].base}</sub>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Case 2: Multiplication */}
                              {stepsExplanation.toBase === "dec" && (
                                <div className="space-y-3">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden min-w-[340px]">
                                      <thead className="bg-slate-100 text-[11px] text-slate-800 border-b-2 border-slate-900 font-bold">
                                        <tr>
                                          <th className="p-2.5">Digit</th>
                                          <th className="p-2.5">Posisi Pangkat</th>
                                          <th className="p-2.5">Bobot ({stepsExplanation.multiplicationData.baseNumber}ⁿ)</th>
                                          <th className="p-2.5">Perkalian</th>
                                          <th className="p-2.5 text-right">Hasil Desimal</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y border-slate-200 text-xs">
                                        {stepsExplanation.multiplicationData.rows.map((r, i) => (
                                          <tr key={i} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-black text-blue-700">{r.digit}</td>
                                            <td className="p-2.5 text-slate-500">Posisi {r.power}</td>
                                            <td className="p-2.5 text-purple-700 font-bold">{r.powerValue}</td>
                                            <td className="p-2.5 text-slate-700">{r.expanded}</td>
                                            <td className="p-2.5 font-black text-emerald-700 text-right">
                                              {r.result}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border-2 border-slate-900 font-mono space-y-2 text-xs">
                                    <div className="text-slate-600 font-bold">Jumlah Total:</div>
                                    <div className="text-slate-900 break-words font-semibold">
                                      {stepsExplanation.multiplicationData.formulaLine3} ={" "}
                                      <strong className="text-emerald-700 text-sm">
                                        {stepsExplanation.multiplicationData.totalDecimal}₁₀
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Case 3: Grouping / Two-stage */}
                              {stepsExplanation.groupingData && renderGroupingSection()}
                            </motion.div>
                          )}

                          {/* ======================================================== */}
                          {/* TAB CONTENT 2: VERSI DI KALI */}
                          {/* ======================================================== */}
                          {activeMethodTab === "multiply" && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <p className="font-bold text-slate-900">
                                  Tabel Penjabaran Perkalian Bobot Posisi ({stepsExplanation.multiplicationData.baseNumber}ⁿ):
                                </p>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden min-w-[400px]">
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

                              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border-2 border-slate-900 font-mono space-y-2.5 overflow-x-auto text-xs shadow-2xs">
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
                                <div className="pt-2 border-t-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-black text-slate-900">
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
                          {/* TAB CONTENT 3: VERSI DI BAGI */}
                          {/* ======================================================== */}
                          {activeMethodTab === "divide" && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <p className="font-bold text-slate-900">
                                  Tabel Pembagian Berulang (Nilai ÷ {stepsExplanation.divisionData.divisor}):
                                </p>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden min-w-[340px]">
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

                              {stepsExplanation.divisionData.fractionalRows && stepsExplanation.divisionData.fractionalRows.length > 0 && (
                                <div className="space-y-2 pt-2">
                                  <p className="font-bold text-slate-900">
                                    Tabel Perkalian Pecahan (Pecahan × {stepsExplanation.divisionData.divisor}):
                                  </p>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono border-2 border-slate-900 rounded-xl overflow-hidden min-w-[340px]">
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

                              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
                                <p className="text-emerald-950 font-bold text-xs">
                                  {stepsExplanation.divisionData.readingOrderText}
                                </p>
                                <div className="px-3 py-1.5 rounded-lg bg-white border-2 border-slate-900 font-mono font-black text-emerald-900 text-sm text-center shrink-0 self-start sm:self-auto shadow-xs">
                                  Hasil Akhir: {stepsExplanation.divisionData.finalResult}
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* ======================================================== */}
                          {/* TAB CONTENT 4: METODE PENGELOMPOKAN BIT */}
                          {/* ======================================================== */}
                          {activeMethodTab === "grouping" && stepsExplanation.groupingData && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              {renderGroupingSection()}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BinaryConverter;

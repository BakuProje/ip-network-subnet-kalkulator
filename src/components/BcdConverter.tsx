import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Copy,
  Check,
  ChevronDown,
  AlertTriangle,
  Cpu,
} from "lucide-react";
import {
  convertDecimalToBcd,
  convertBcdToDecimal,
  BCD_DIGIT_MAP,
} from "@/lib/asciiBcd";

const BcdConverter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"decToBcd" | "bcdToDec">("decToBcd");

  // 1. Decimal to BCD
  const [decInput, setDecInput] = useState<string>("309");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 2. BCD to Decimal
  const [bcdInput, setBcdInput] = useState<string>("0011 0000 1001");

  // Calculations
  const bcdResult = useMemo(() => {
    return convertDecimalToBcd(decInput);
  }, [decInput]);

  const bcdToDecResult = useMemo(() => {
    return convertBcdToDecimal(bcdInput);
  }, [bcdInput]);

  const copyText = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="neo-box bg-white overflow-hidden space-y-0">
      {/* Collapsible Header Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors border-b-2 border-slate-900 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-slate-950 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Kalkulator BCD
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Pengkodean bilangan desimal satu per satu menjadi 4-bit biner (8421 BCD)
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
            <div className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border-2 border-slate-900 w-fit">
                <button
                  onClick={() => setActiveTab("decToBcd")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "decToBcd"
                      ? "bg-amber-500 text-slate-950 border border-slate-900 shadow-xs"
                      : "text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  Desimal → BCD
                </button>
                <button
                  onClick={() => setActiveTab("bcdToDec")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "bcdToDec"
                      ? "bg-amber-500 text-slate-950 border border-slate-900 shadow-xs"
                      : "text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  BCD → Desimal
                </button>
              </div>

              {/* TAB 1: DESIMAL KE BCD */}
              {activeTab === "decToBcd" && (
                <div className="space-y-4">
                  {/* Input & Output Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">
                        Input Bilangan Desimal (Basis 10):
                      </label>
                      <input
                        type="text"
                        value={decInput}
                        onChange={(e) => setDecInput(e.target.value.replace(/\D/g, ""))}
                        placeholder="Ketik angka desimal (contoh: 309 atau 170)..."
                        className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-base font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900">
                          Nilai BCD Hasil Konversi:
                        </label>
                        {bcdResult.isValid && (
                          <button
                            onClick={() => copyText(bcdResult.bcdFormatted, "bcd")}
                            className="flex items-center gap-1 text-xs text-blue-700 font-bold"
                          >
                            {copiedKey === "bcd" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedKey === "bcd" ? "Disalin!" : "Salin BCD"}
                          </button>
                        )}
                      </div>
                      <div className="min-h-[46px] bg-amber-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 font-mono text-base font-black text-amber-950 flex items-center break-all shadow-inner">
                        {bcdResult.isValid ? (
                          bcdResult.bcdFormatted
                        ) : (
                          <span className="text-slate-400 text-sm font-normal">Menunggu angka desimal valid...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Cards */}
                  {bcdResult.isValid && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                          Langkah Penguraian per Digit:
                        </h4>
                      </div>

                      {/* Digit Breakdown Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {bcdResult.digits.map((item) => (
                          <div
                            key={item.position}
                            className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_0px_#0f172a] space-y-2.5"
                          >
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                              <span className="text-[10px] font-bold text-slate-500">
                                Digit #{item.position}
                              </span>
                              <span className="text-xs font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                {item.digit}₁₀
                              </span>
                            </div>

                            {/* Bit Weights 8-4-2-1 */}
                            <div className="grid grid-cols-4 gap-1 text-center font-mono">
                              <div className={`p-1 rounded border text-[10px] font-bold ${item.bit8 ? "bg-amber-400 border-slate-900 text-slate-950 font-black" : "bg-white border-slate-200 text-slate-400"}`}>
                                8={item.bit8}
                              </div>
                              <div className={`p-1 rounded border text-[10px] font-bold ${item.bit4 ? "bg-amber-400 border-slate-900 text-slate-950 font-black" : "bg-white border-slate-200 text-slate-400"}`}>
                                4={item.bit4}
                              </div>
                              <div className={`p-1 rounded border text-[10px] font-bold ${item.bit2 ? "bg-amber-400 border-slate-900 text-slate-950 font-black" : "bg-white border-slate-200 text-slate-400"}`}>
                                2={item.bit2}
                              </div>
                              <div className={`p-1 rounded border text-[10px] font-bold ${item.bit1 ? "bg-amber-400 border-slate-900 text-slate-950 font-black" : "bg-white border-slate-200 text-slate-400"}`}>
                                1={item.bit1}
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-white border border-slate-300 font-mono text-xs text-center font-black text-slate-900 shadow-2xs">
                              <span className="text-blue-700">{item.digit}₁₀</span> —–&gt;{" "}
                              <span className="text-amber-800">{item.bcdBits} BCD</span>
                            </div>

                            <p className="text-[10px] text-slate-500 font-mono text-center">
                              {item.explanation}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Final Result Summary */}
                      <div className="p-4 rounded-xl border-2 border-slate-900 bg-amber-50 space-y-2 shadow-2xs font-mono">
                        <div className="text-xs font-bold text-slate-700">
                          Hasil Akhir BCD:
                        </div>
                        <div className="text-sm font-black text-amber-950 break-words leading-relaxed">
                          Nilai BCD dari <span className="text-blue-700">{bcdResult.inputDecimal}₁₀</span> adalah{" "}
                          <span className="px-2 py-1 bg-white border border-slate-900 rounded-md text-amber-900 inline-block shadow-2xs">
                            {bcdResult.bcdFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Comparison: BCD vs Pure Binary */}
                      <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-3">
                        <div className="flex items-center gap-2 font-black text-xs text-slate-900 uppercase">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          <span>Perbandingan: BCD (4-Bit/Digit) vs Biner Murni (Pure Binary)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                          <div className="p-3 bg-white border-2 border-slate-900 rounded-xl space-y-1">
                            <span className="text-[11px] font-bold text-slate-500 block">
                              Format BCD (Binary Coded Decimal):
                            </span>
                            <p className="text-base font-black text-amber-800 break-all">
                              {bcdResult.bcdRaw}
                            </p>
                            <div className="text-[11px] text-slate-600 font-sans">
                              Ukuran: <strong>{bcdResult.totalBcdBits} bit</strong> ({bcdResult.digits.length} digit × 4 bit)
                            </div>
                          </div>

                          <div className="p-3 bg-white border-2 border-slate-900 rounded-xl space-y-1">
                            <span className="text-[11px] font-bold text-slate-500 block">
                              Format Biner Murni (Pure Binary):
                            </span>
                            <p className="text-base font-black text-emerald-700 break-all">
                              {bcdResult.pureBinary}₂
                            </p>
                            <div className="text-[11px] text-slate-600 font-sans">
                              Ukuran: <strong>{bcdResult.totalPureBinaryBits} bit</strong> (Representasi nilai matematis basis 2)
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-sans leading-relaxed">
                          💡 {bcdResult.bitsRatioExplanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: BCD KE DESIMAL */}
              {activeTab === "bcdToDec" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-900">
                        Masukkan Bit BCD (Kelompok 4 Bit 0000 - 1001):
                      </label>
                      <input
                        type="text"
                        value={bcdInput}
                        onChange={(e) => setBcdInput(e.target.value)}
                        placeholder="Contoh: 0011 0000 1001 (pisah spasi atau bersambung)..."
                        className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                      />
                    </div>

                    {!bcdToDecResult.isValid && bcdToDecResult.errorMessage && (
                      <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{bcdToDecResult.errorMessage}</span>
                      </div>
                    )}

                    {bcdToDecResult.chunks.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700">
                          Penguraian Tiap Nibble (4 Bit):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {bcdToDecResult.chunks.map((chk) => (
                            <div
                              key={chk.chunkIndex}
                              className={`p-3 rounded-xl border-2 text-center space-y-1 ${chk.isValid
                                  ? "bg-white border-slate-900 shadow-2xs"
                                  : "bg-rose-50 border-rose-500 shadow-2xs"
                                }`}
                            >
                              <span className="text-[10px] font-bold text-slate-500 block">
                                Nibble #{chk.chunkIndex}
                              </span>
                              <div className="font-mono font-bold text-xs bg-slate-100 py-0.5 rounded">
                                {chk.bits}
                              </div>
                              <div className="text-slate-400 text-[10px]">↓</div>
                              <div
                                className={`font-mono font-black text-lg ${chk.isValid ? "text-amber-800" : "text-rose-600"
                                  }`}
                              >
                                {chk.digit}
                              </div>
                              {chk.error && (
                                <p className="text-[9px] text-rose-600 font-semibold">{chk.error}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-900">
                          Hasil Bilangan Desimal (Basis 10):
                        </label>
                        {bcdToDecResult.isValid && (
                          <button
                            onClick={() => copyText(bcdToDecResult.decimalResult, "bcdDec")}
                            className="flex items-center gap-1 text-xs text-blue-700 font-bold"
                          >
                            {copiedKey === "bcdDec" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedKey === "bcdDec" ? "Disalin!" : "Salin Desimal"}
                          </button>
                        )}
                      </div>
                      <div className="min-h-[50px] bg-amber-50 border-2 border-slate-900 rounded-xl p-3.5 font-mono text-xl font-black text-amber-950 flex items-center shadow-inner break-all">
                        {bcdToDecResult.isValid ? (
                          `${bcdToDecResult.decimalResult}₁₀`
                        ) : (
                          <span className="text-rose-600 text-sm font-bold">Input BCD Ilegal / Invalid</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Table (0 - 9) */}
              <div className="p-4 rounded-xl border-2 border-slate-900 bg-white space-y-3 shadow-2xs">
                <h4 className="text-xs font-black text-slate-900 uppercase">
                  Tabel Standar BCD 8421 (Digit 0 s/d 9):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                  {Object.entries(BCD_DIGIT_MAP).map(([digit, bcd]) => (
                    <div
                      key={digit}
                      className="p-2.5 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-between"
                    >
                      <span className="font-bold text-slate-700">Desimal {digit}:</span>
                      <span className="font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                        {bcd}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BcdConverter;

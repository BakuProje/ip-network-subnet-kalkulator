import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import {
  convertTextToAscii,
  convertAsciiCodeToText,
} from "@/lib/asciiBcd";

const AsciiConverter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"textToAscii" | "asciiToText">("textToAscii");

  // 1. Text to ASCII State
  const [inputText, setInputText] = useState<string>("StMiK");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 2. ASCII to Text State
  const [inputAsciiCode, setInputAsciiCode] = useState<string>("83 116 77 105 75");
  const [asciiFormat, setAsciiFormat] = useState<"dec" | "bin" | "hex">("dec");

  // Calculated Text to ASCII
  const asciiResult = useMemo(() => {
    return convertTextToAscii(inputText);
  }, [inputText]);

  // Calculated ASCII to Text
  const decodedText = useMemo(() => {
    return convertAsciiCodeToText(inputAsciiCode, asciiFormat);
  }, [inputAsciiCode, asciiFormat]);

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
          <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-white shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Kalkulator ASCII
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Konversi Teks ke Kode ASCII (Desimal, Biner 8-Bit, Heksadesimal) &amp; Sebaliknya
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
              {/* Tab Selector: Teks to ASCII vs ASCII to Teks */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border-2 border-slate-900 w-fit">
                <button
                  onClick={() => setActiveTab("textToAscii")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${activeTab === "textToAscii"
                    ? "bg-blue-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    : "text-slate-800 hover:bg-slate-200 border-2 border-transparent"
                    }`}
                >
                  <span>Teks</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span>ASCII</span>
                </button>
                <button
                  onClick={() => setActiveTab("asciiToText")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${activeTab === "asciiToText"
                    ? "bg-blue-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    : "text-slate-800 hover:bg-slate-200 border-2 border-transparent"
                    }`}
                >
                  <span>ASCII</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span>Teks</span>
                </button>
              </div>

              {/* TAB 1: TEKS KE ASCII */}
              {activeTab === "textToAscii" && (
                <div className="space-y-4">
                  {/* Input Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Masukkan Teks:</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {inputText.length} Karakter
                      </span>
                    </label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ketik teks di sini (contoh: StMiK atau DiPaNegArA)..."
                      rows={2}
                      className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl p-3 font-mono text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                    />
                  </div>

                  {/* Breakdown per character */}
                  {asciiResult.characters.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                          Penguraian Karakter per Karakter:
                        </h4>
                      </div>

                      {/* Grid Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {asciiResult.characters.map((ch) => (
                          <div
                            key={ch.index}
                            className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_0px_#0f172a] space-y-2 hover:bg-white transition-colors"
                          >
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                              <span className="text-[10px] font-bold text-slate-500">
                                Posisi #{ch.index}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 text-[10px] font-mono font-bold">
                                {ch.altCode}
                              </span>
                            </div>

                            <div className="text-center py-1">
                              <span className="text-3xl font-black text-blue-700 font-mono">
                                {ch.displayChar}
                              </span>
                            </div>

                            <div className="p-2 rounded-lg bg-white border border-slate-300 font-mono text-xs text-center font-bold text-slate-900 shadow-2xs">
                              <span className="text-purple-700 font-black">{ch.char}</span> ={" "}
                              <span className="text-blue-700 font-black">{ch.dec}₁₀</span> ={" "}
                              <span className="text-emerald-700 font-black">{ch.bin}₂</span>
                            </div>

                            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                              <div className="bg-slate-100 p-1 rounded text-slate-700 text-center">
                                Hex: <strong>0x{ch.hex}</strong>
                              </div>
                              <div className="bg-slate-100 p-1 rounded text-slate-700 text-center">
                                Oktal: <strong>{ch.oct}₈</strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Formats */}
                      <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-2xs">
                        <h4 className="text-xs font-black text-slate-900 uppercase">
                          Representasi Keseluruhan:
                        </h4>

                        {/* Decimal */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>1. Kode Desimal ASCII:</span>
                            <button
                              onClick={() => copyText(asciiResult.decimalString, "dec")}
                              className="flex items-center gap-1 text-blue-700 hover:text-blue-900"
                            >
                              {copiedKey === "dec" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedKey === "dec" ? "Disalin!" : "Salin Desimal"}
                            </button>
                          </div>
                          <div className="p-2.5 bg-white border-2 border-slate-900 rounded-lg font-mono text-xs font-bold text-blue-900 break-all shadow-inner">
                            {asciiResult.decimalString}
                          </div>
                        </div>

                        {/* Binary 8-bit */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>2. Biner ASCII:</span>
                            <button
                              onClick={() => copyText(asciiResult.binaryString, "bin")}
                              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900"
                            >
                              {copiedKey === "bin" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedKey === "bin" ? "Disalin!" : "Salin Biner"}
                            </button>
                          </div>
                          <div className="p-2.5 bg-emerald-50 border-2 border-slate-900 rounded-lg font-mono text-xs font-bold text-emerald-900 break-all shadow-inner">
                            {asciiResult.binaryString}
                          </div>
                        </div>

                        {/* Hexadecimal */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>3. Heksadesimal:</span>
                            <button
                              onClick={() => copyText(asciiResult.hexString, "hex")}
                              className="flex items-center gap-1 text-purple-700 hover:text-purple-900"
                            >
                              {copiedKey === "hex" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedKey === "hex" ? "Disalin!" : "Salin Hex"}
                            </button>
                          </div>
                          <div className="p-2.5 bg-purple-50 border-2 border-slate-900 rounded-lg font-mono text-xs font-bold text-purple-900 break-all shadow-inner">
                            {asciiResult.hexString}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ASCII KE TEKS */}
              {activeTab === "asciiToText" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-slate-900">
                        Format Kode Masukan:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setAsciiFormat("dec");
                            setInputAsciiCode("83 116 77 105 75");
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${asciiFormat === "dec"
                            ? "bg-blue-600 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-300"
                            }`}
                        >
                          Desimal
                        </button>
                        <button
                          onClick={() => {
                            setAsciiFormat("bin");
                            setInputAsciiCode("01010011 01110100 01001101 01101001 01001011");
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${asciiFormat === "bin"
                            ? "bg-emerald-600 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-300"
                            }`}
                        >
                          Biner
                        </button>
                        <button
                          onClick={() => {
                            setAsciiFormat("hex");
                            setInputAsciiCode("53 74 4D 69 4B");
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${asciiFormat === "hex"
                            ? "bg-purple-600 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-300"
                            }`}
                        >
                          Hexadesimal
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={inputAsciiCode}
                        onChange={(e) => setInputAsciiCode(e.target.value)}
                        placeholder="Contoh: 83 116 77 105 75 (pisahkan spasi atau koma)..."
                        className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                      />
                    </div>

                    {/* Decoded Result */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-900">
                          Hasil Dekode Teks:
                        </label>
                        {decodedText && (
                          <button
                            onClick={() => copyText(decodedText, "decoded")}
                            className="flex items-center gap-1 text-xs text-blue-700 font-bold"
                          >
                            {copiedKey === "decoded" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedKey === "decoded" ? "Disalin!" : "Salin Teks"}
                          </button>
                        )}
                      </div>
                      <div className="min-h-[50px] bg-emerald-50 border-2 border-slate-900 rounded-xl p-3.5 font-mono text-lg font-black text-emerald-950 flex items-center shadow-inner break-all">
                        {decodedText || <span className="text-slate-400 text-sm font-normal">Menunggu input kode ASCII valid...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AsciiConverter;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, ChevronDown, Info } from "lucide-react";
import { binaryToDecimal, decimalToBinary } from "@/lib/subnet";

const BinaryConverter = () => {
  const [binInput, setBinInput] = useState("");
  const [decInput, setDecInput] = useState("");
  const [binResult, setBinResult] = useState<string | null>(null);
  const [decResult, setDecResult] = useState<string | null>(null);
  const [showBinToDecSteps, setShowBinToDecSteps] = useState(false);
  const [showDecToBinSteps, setShowDecToBinSteps] = useState(false);

  // Fungsi untuk mengkonversi angka ke superscript
  const toSuperscript = (num: number): string => {
    const superscripts: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return num.toString().split('').map(digit => superscripts[digit] || digit).join('');
  };

  // Fungsi untuk menghitung langkah-langkah konversi biner ke desimal
  const calculateBinToDecSteps = (binary: string) => {
    if (!binary || !/^[01]+$/.test(binary)) return null;
    
    const bits = binary.split('').reverse();
    const steps = bits.map((bit, index) => ({
      bit,
      power: index,
      value: parseInt(bit) * Math.pow(2, index),
      calculation: `(${bit} × 2${toSuperscript(index)})`,
      expanded: `(${bit} × ${Math.pow(2, index)})`
    }));
    
    const total = steps.reduce((sum, step) => sum + step.value, 0);
    
    return { steps: steps.reverse(), total };
  };

  // Fungsi untuk menghitung langkah-langkah konversi desimal ke biner
  const calculateDecToBinSteps = (decimal: number) => {
    if (isNaN(decimal) || decimal < 0) return null;
    
    const steps = [];
    let num = decimal;
    let step = 1;
    
    while (num > 0) {
      const remainder = num % 2;
      const quotient = Math.floor(num / 2);
      steps.push({
        step,
        division: `${num} ÷ 2 = ${quotient}`,
        remainder: `sisa ${remainder}`
      });
      num = quotient;
      step++;
    }
    
    if (steps.length === 0) {
      steps.push({
        step: 1,
        division: `0 ÷ 2 = 0`,
        remainder: `sisa 0`
      });
    }
    
    return steps;
  };

  const handleBinToDecConvert = () => {
    const result = binaryToDecimal(binInput);
    setDecResult(result !== null ? String(result) : "Input tidak valid");
  };

  const handleDecToBinConvert = () => {
    const n = Number(decInput);
    const result = decimalToBinary(n);
    setBinResult(result !== null ? result : "Input tidak valid");
  };

  const binToDecSteps = binInput ? calculateBinToDecSteps(binInput) : null;
  const decToBinSteps = decInput ? calculateDecToBinSteps(Number(decInput)) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-5">
        <ArrowRightLeft className="w-4 h-4 text-accent" />
        Kalkulator Biner ↔ Desimal
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Binary to Decimal */}
        <div className="space-y-3">
          <label className="text-xs text-muted-foreground font-medium">Biner → Desimal</label>
          <input
            type="text"
            value={binInput}
            onChange={(e) => {
              const v = e.target.value.replace(/[^01]/g, "");
              setBinInput(v);
              // Reset hasil saat input dihapus
              if (v === "") {
                setDecResult(null);
              }
            }}
            placeholder="Contoh: 110110"
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleBinToDecConvert}
            disabled={!binInput}
            className="w-full py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-40"
          >
            Konversi ke Desimal
          </button>
          {decResult !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-mono bg-muted/30 rounded-lg px-3 py-2 text-secondary"
            >
              Hasil: {decResult}
            </motion.div>
          )}
          
          {/* Cara Kerja Biner ke Desimal */}
          {binInput && binToDecSteps && (
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowBinToDecSteps(!showBinToDecSteps)}
                className="w-full flex items-center justify-between px-3 py-2 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Cara Kerja
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showBinToDecSteps ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {showBinToDecSteps && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-3 space-y-2 text-xs">
                      <p className="text-muted-foreground">Cara mengubah <span className="text-primary font-mono">{binInput}</span> (biner) ke desimal:</p>
                      
                      {/* Formula */}
                      <div className="bg-muted/30 rounded p-2 font-mono text-[10px] overflow-x-auto">
                        <div className="whitespace-nowrap">
                          {binToDecSteps.steps.map((s, i) => (
                            <span key={i}>
                              {s.calculation}
                              {i < binToDecSteps.steps.length - 1 ? " + " : ""}
                            </span>
                          ))}
                        </div>
                        <div className="whitespace-nowrap mt-1">
                          = {binToDecSteps.steps.map((s, i) => (
                            <span key={i}>
                              {s.expanded}
                              {i < binToDecSteps.steps.length - 1 ? " + " : ""}
                            </span>
                          ))}
                        </div>
                        <div className="whitespace-nowrap mt-1">
                          = {binToDecSteps.steps.map((s, i) => (
                            <span key={i}>
                              {s.value}
                              {i < binToDecSteps.steps.length - 1 ? " + " : ""}
                            </span>
                          ))}
                        </div>
                        <div className="mt-1 text-secondary font-bold">
                          = {binToDecSteps.total}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Decimal to Binary */}
        <div className="space-y-3">
          <label className="text-xs text-muted-foreground font-medium">Desimal → Biner</label>
          <input
            type="text"
            value={decInput}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              setDecInput(v);
              // Reset hasil saat input dihapus
              if (v === "") {
                setBinResult(null);
              }
            }}
            placeholder="Contoh: 45"
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleDecToBinConvert}
            disabled={!decInput}
            className="w-full py-2 rounded-lg bg-secondary/10 text-secondary border border-secondary/30 text-xs font-medium hover:bg-secondary/20 transition-colors disabled:opacity-40"
          >
            Konversi ke Biner
          </button>
          {binResult !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-mono bg-muted/30 rounded-lg px-3 py-2 text-primary"
            >
              Hasil: {binResult}
            </motion.div>
          )}
          
          {/* Cara Kerja Desimal ke Biner */}
          {decInput && decToBinSteps && (
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowDecToBinSteps(!showDecToBinSteps)}
                className="w-full flex items-center justify-between px-3 py-2 bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-medium text-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Cara Kerja
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showDecToBinSteps ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {showDecToBinSteps && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-3 space-y-2 text-xs">
                      <p className="text-muted-foreground">Cara mengubah <span className="text-secondary font-mono">{decInput}</span> (desimal) ke biner adalah dengan metode pembagian 2 berulang.</p>
                      
                      <div className="bg-muted/30 rounded p-2 space-y-1">
                        <p className="font-semibold text-foreground mb-1">Langkah-langkah:</p>
                        {decToBinSteps.map((step, index) => (
                          <div key={index} className="font-mono text-[10px] text-foreground">
                            <span className="text-accent">{step.step}.</span> {step.division} <span className="text-secondary font-bold">{step.remainder}</span>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <p className="text-muted-foreground text-[10px]">Baca sisa dari bawah ke atas:</p>
                          <p className="font-mono text-primary font-bold mt-1">Hasil: {binResult}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinaryConverter;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

const IPToBinaryConverter = () => {
  const [ipInput, setIpInput] = useState("");
  const [result, setResult] = useState<{
    binary: string;
    octets: Array<{ decimal: number; binary: string }>;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const convertIPToBinary = (ip: string) => {
    if (!ip.trim()) {
      setResult(null);
      return;
    }

    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      setResult(null);
      return;
    }

    const octets = parts.map(num => ({
      decimal: num,
      binary: num.toString(2).padStart(8, "0")
    }));

    const fullBinary = octets.map(o => o.binary).join(".");

    setResult({
      binary: fullBinary,
      octets
    });
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.binary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">IP to Binary Converter</h3>

      <div className="space-y-3">
        <input
          type="text"
          value={ipInput}
          onChange={(e) => {
            setIpInput(e.target.value);
            convertIPToBinary(e.target.value);
          }}
          placeholder="Contoh: 192.168.1.1"
          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Full Binary */}
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Binary Lengkap:</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-primary flex-1 break-all">{result.binary}</p>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Per Octet */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Per Oktet:</p>
                <div className="grid grid-cols-4 gap-2">
                  {result.octets.map((octet, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card rounded-lg p-2 border border-border/50 text-center"
                    >
                      <p className="text-xs text-muted-foreground mb-1">Oktet {idx + 1}</p>
                      <p className="font-mono text-sm text-primary font-semibold">{octet.decimal}</p>
                      <p className="font-mono text-xs text-secondary mt-1">{octet.binary}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IPToBinaryConverter;

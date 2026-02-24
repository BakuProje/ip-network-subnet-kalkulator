import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, AlertCircle } from "lucide-react";

const PrivatePublicChecker = () => {
  const [ipInput, setIpInput] = useState("");
  const [result, setResult] = useState<{
    type: "private" | "public" | "special";
    range: string;
    description: string;
  } | null>(null);

  const checkIP = (ip: string) => {
    if (!ip.trim()) {
      setResult(null);
      return;
    }

    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      setResult(null);
      return;
    }

    const [a, b, c, d] = parts;

    // Private ranges
    if (a === 10) {
      setResult({
        type: "private",
        range: "10.0.0.0 - 10.255.255.255",
        description: "Private Class A - Jaringan internal organisasi besar"
      });
    } else if (a === 172 && b >= 16 && b <= 31) {
      setResult({
        type: "private",
        range: "172.16.0.0 - 172.31.255.255",
        description: "Private Class B - Jaringan internal organisasi menengah"
      });
    } else if (a === 192 && b === 168) {
      setResult({
        type: "private",
        range: "192.168.0.0 - 192.168.255.255",
        description: "Private Class C - Jaringan internal rumah/kantor kecil"
      });
    } else if (a === 127) {
      setResult({
        type: "special",
        range: "127.0.0.0 - 127.255.255.255",
        description: "Loopback Address - Untuk testing lokal"
      });
    } else if (a === 169 && b === 254) {
      setResult({
        type: "special",
        range: "169.254.0.0 - 169.254.255.255",
        description: "Link-Local Address - Untuk auto-configuration"
      });
    } else if (a >= 224 && a <= 239) {
      setResult({
        type: "special",
        range: "224.0.0.0 - 239.255.255.255",
        description: "Multicast Address - Untuk komunikasi grup"
      });
    } else if (a >= 240) {
      setResult({
        type: "special",
        range: "240.0.0.0 - 255.255.255.255",
        description: "Reserved Address - Untuk penggunaan masa depan"
      });
    } else {
      setResult({
        type: "public",
        range: "Public IP Range",
        description: "IP Address publik - Dapat diakses dari internet"
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Private vs Public IP Checker</h3>

      <div className="space-y-3">
        <input
          type="text"
          value={ipInput}
          onChange={(e) => {
            setIpInput(e.target.value);
            checkIP(e.target.value);
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
              className={`rounded-lg p-3 border ${
                result.type === "private"
                  ? "bg-blue-500/10 border-blue-500/30"
                  : result.type === "public"
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.type === "private" ? (
                  <Shield className="w-4 h-4 text-blue-500" />
                ) : result.type === "public" ? (
                  <Globe className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className={`text-sm font-semibold ${
                  result.type === "private"
                    ? "text-blue-500"
                    : result.type === "public"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}>
                  {result.type === "private" ? "Private IP" : result.type === "public" ? "Public IP" : "Special IP"}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground font-mono">{result.range}</p>
                <p className="text-muted-foreground">{result.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrivatePublicChecker;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    const [a, b] = parts;

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
        description: "Loopback Address - Pengujian lokal (localhost)"
      });
    } else if (a === 169 && b === 254) {
      setResult({
        type: "special",
        range: "169.254.0.0 - 169.254.255.255",
        description: "Link-Local (APIPA) - Auto-konfigurasi"
      });
    } else if (a >= 224 && a <= 239) {
      setResult({
        type: "special",
        range: "224.0.0.0 - 239.255.255.255",
        description: "Multicast Address - Komunikasi grup"
      });
    } else if (a >= 240) {
      setResult({
        type: "special",
        range: "240.0.0.0 - 255.255.255.255",
        description: "Reserved Address - Penggunaan masa depan"
      });
    } else {
      setResult({
        type: "public",
        range: "Public IP Range (Internet Global)",
        description: "IP Address Publik - Dapat diakses secara global di internet"
      });
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Pengecek IP Publik vs Privat
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-neutral-500 font-medium mb-1 block">
            Alamat IP untuk Dicek:
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => {
              setIpInput(e.target.value);
              checkIP(e.target.value);
            }}
            placeholder="Contoh: 192.168.1.1 atau 8.8.8.8"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="rounded-lg p-3.5 border border-neutral-200 bg-neutral-50 text-neutral-900 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {result.type === "private" ? "IP Private (Lokal)" : result.type === "public" ? "IP Public (Internet)" : "IP Khusus (Special/Reserved)"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                  {result.type}
                </span>
              </div>

              <p className="font-mono text-xs font-semibold text-neutral-800 pt-0.5">{result.range}</p>
              <p className="text-xs text-neutral-500">{result.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrivatePublicChecker;

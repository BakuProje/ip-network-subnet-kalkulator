import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NetworkPlanningTool = () => {
  const [hostsNeeded, setHostsNeeded] = useState("");
  const [result, setResult] = useState<{
    subnetMask: string;
    cidr: number;
    totalHosts: number;
    usableHosts: number;
    hostBits: number;
    recommendation: string;
  } | null>(null);

  const calculateNetworkPlan = () => {
    if (!hostsNeeded.trim()) {
      setResult(null);
      return;
    }

    const hosts = parseInt(hostsNeeded);
    if (isNaN(hosts) || hosts < 1) return;

    let hostBits = 0;
    let totalHosts = 1;

    while (totalHosts - 2 < hosts) {
      hostBits++;
      totalHosts = Math.pow(2, hostBits);
    }

    const cidr = 32 - hostBits;
    const usableHosts = totalHosts - 2;

    const maskValue = (0xffffffff << hostBits) >>> 0;
    const subnetMask = [
      (maskValue >> 24) & 0xff,
      (maskValue >> 16) & 0xff,
      (maskValue >> 8) & 0xff,
      maskValue & 0xff
    ].join(".");

    let recommendation = "";
    if (cidr >= 24) {
      recommendation = "Rekomendasi Kelas C — Cocok untuk jaringan skala kecil / LAN";
    } else if (cidr >= 16) {
      recommendation = "Rekomendasi Kelas B — Cocok untuk jaringan skala menengah / gedung";
    } else {
      recommendation = "Rekomendasi Kelas A — Cocok untuk jaringan skala besar / enterprise";
    }

    setResult({
      subnetMask,
      cidr,
      totalHosts,
      usableHosts,
      hostBits,
      recommendation
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Perencanaan Kebutuhan Host
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={hostsNeeded}
            onChange={(e) => {
              setHostsNeeded(e.target.value);
              if (e.target.value === "") setResult(null);
            }}
            min="1"
            placeholder="Jumlah host yang dibutuhkan (misal: 50)"
            className="flex-1 bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
          <button
            onClick={calculateNetworkPlan}
            className="px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
          >
            Hitung
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2.5"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-0.5">Subnet Mask Disarankan</p>
                  <p className="font-mono text-sm text-neutral-900 font-bold">{result.subnetMask}</p>
                </div>

                <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-0.5">Notasi CIDR</p>
                  <p className="font-mono text-sm text-neutral-900 font-bold">/{result.cidr}</p>
                </div>

                <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-0.5">Total Alokasi Host</p>
                  <p className="font-mono text-sm text-neutral-900 font-bold">{result.totalHosts.toLocaleString()}</p>
                </div>

                <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-0.5">Host Valid / Usable</p>
                  <p className="font-mono text-sm text-neutral-900 font-bold">{result.usableHosts.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-3">
                <p className="text-xs text-neutral-800 font-medium">{result.recommendation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NetworkPlanningTool;

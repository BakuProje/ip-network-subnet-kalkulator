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

    // Calculate required host bits
    let hostBits = 0;
    let totalHosts = 1;

    while (totalHosts - 2 < hosts) {
      hostBits++;
      totalHosts = Math.pow(2, hostBits);
    }

    const cidr = 32 - hostBits;
    const usableHosts = totalHosts - 2;

    // Calculate subnet mask
    const maskValue = (0xffffffff << hostBits) >>> 0;
    const subnetMask = [
      (maskValue >> 24) & 0xff,
      (maskValue >> 16) & 0xff,
      (maskValue >> 8) & 0xff,
      maskValue & 0xff
    ].join(".");

    let recommendation = "";
    if (cidr >= 24) {
      recommendation = "Gunakan Kelas C - Cocok untuk jaringan kecil/rumah";
    } else if (cidr >= 16) {
      recommendation = "Gunakan Kelas B - Cocok untuk jaringan menengah";
    } else {
      recommendation = "Gunakan Kelas A - Cocok untuk jaringan besar";
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
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Network Planning Tool</h3>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={hostsNeeded}
            onChange={(e) => {
              setHostsNeeded(e.target.value);
              // Reset hasil saat input dihapus
              if (e.target.value === "") {
                setResult(null);
              }
            }}
            min="1"
            placeholder="Jumlah host yang dibutuhkan"
            className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={calculateNetworkPlan}
            className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            Hitung
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Subnet Mask</p>
                  <p className="font-mono text-sm text-primary font-semibold">{result.subnetMask}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">CIDR</p>
                  <p className="font-mono text-sm text-secondary font-semibold">/{result.cidr}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Host</p>
                  <p className="font-mono text-sm text-accent font-semibold">{result.totalHosts}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Host Usable</p>
                  <p className="font-mono text-sm text-foreground font-semibold">{result.usableHosts}</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-500 font-semibold">{result.recommendation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NetworkPlanningTool;

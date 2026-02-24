import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const SubnetCalculator = () => {
  const [networkAddress, setNetworkAddress] = useState("");
  const [prefixLength, setPrefixLength] = useState("24");
  const [result, setResult] = useState<{
    subnets: Array<{
      number: number;
      networkAddress: string;
      firstHost: string;
      lastHost: string;
      broadcastAddress: string;
    }>;
    subnetMask: string;
    totalSubnets: number;
  } | null>(null);
  const [showSubnets, setShowSubnets] = useState(false);
  const [numSubnets, setNumSubnets] = useState("2");

  const calculateSubnets = () => {
    if (!networkAddress.trim() || !prefixLength || !numSubnets) return;

    const parts = networkAddress.split(".").map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return;

    const prefix = parseInt(prefixLength);
    const subnetsNeeded = parseInt(numSubnets);

    if (prefix < 0 || prefix > 30 || subnetsNeeded < 1) return;

    // Calculate subnet mask
    const maskBits = 32 - prefix;
    const subnetBits = Math.ceil(Math.log2(subnetsNeeded));
    const newPrefix = prefix - subnetBits;

    if (newPrefix < 0) return;

    // Generate subnets
    const subnets = [];
    const increment = Math.pow(2, maskBits + subnetBits);

    for (let i = 0; i < subnetsNeeded; i++) {
      const baseIP = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const subnetIP = baseIP + i * increment;

      const a = (subnetIP >> 24) & 0xff;
      const b = (subnetIP >> 16) & 0xff;
      const c = (subnetIP >> 8) & 0xff;
      const d = subnetIP & 0xff;

      const networkAddr = `${a}.${b}.${c}.${d}`;
      const firstHost = `${a}.${b}.${c}.${d + 1}`;
      const broadcastAddr = `${a}.${b}.${c}.${d + increment - 1}`;
      const lastHost = `${a}.${b}.${c}.${d + increment - 2}`;

      subnets.push({
        number: i + 1,
        networkAddress: networkAddr,
        firstHost,
        lastHost,
        broadcastAddress: broadcastAddr
      });
    }

    // Calculate subnet mask
    const maskValue = (0xffffffff << (32 - newPrefix)) >>> 0;
    const subnetMask = [
      (maskValue >> 24) & 0xff,
      (maskValue >> 16) & 0xff,
      (maskValue >> 8) & 0xff,
      maskValue & 0xff
    ].join(".");

    setResult({
      subnets: subnets.slice(0, 10),
      subnetMask,
      totalSubnets: subnetsNeeded
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Subnet Calculator</h3>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={networkAddress}
            onChange={(e) => {
              setNetworkAddress(e.target.value);
              // Reset hasil saat input dihapus
              if (e.target.value === "") {
                setResult(null);
              }
            }}
            placeholder="Network Address"
            className="bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <input
            type="number"
            value={prefixLength}
            onChange={(e) => setPrefixLength(e.target.value)}
            min="0"
            max="30"
            placeholder="Prefix (/24)"
            className="bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <input
            type="number"
            value={numSubnets}
            onChange={(e) => setNumSubnets(e.target.value)}
            min="1"
            max="256"
            placeholder="Jumlah Subnet"
            className="bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <button
          onClick={calculateSubnets}
          className="w-full py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          Hitung Subnet
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Subnet Mask:</p>
                <p className="font-mono text-sm text-primary font-semibold">{result.subnetMask}</p>
              </div>

              <div>
                <button
                  onClick={() => setShowSubnets(!showSubnets)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-muted/20 hover:bg-muted/30 rounded-lg transition-colors"
                >
                  <span className="text-xs font-medium text-foreground">
                    Tampilkan {Math.min(10, result.totalSubnets)} dari {result.totalSubnets} Subnet
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showSubnets ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showSubnets && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {result.subnets.map((subnet, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="bg-card rounded-lg p-2 border border-border/50 text-xs space-y-1"
                          >
                            <p className="font-semibold text-foreground">Subnet {subnet.number}</p>
                            <p className="font-mono text-muted-foreground">
                              Network: <span className="text-primary">{subnet.networkAddress}</span>
                            </p>
                            <p className="font-mono text-muted-foreground">
                              Range: <span className="text-secondary">{subnet.firstHost} - {subnet.lastHost}</span>
                            </p>
                            <p className="font-mono text-muted-foreground">
                              Broadcast: <span className="text-accent">{subnet.broadcastAddress}</span>
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubnetCalculator;

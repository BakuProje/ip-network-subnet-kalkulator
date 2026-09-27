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

    const maskBits = 32 - prefix;
    const subnetBits = Math.ceil(Math.log2(subnetsNeeded));
    const newPrefix = prefix - subnetBits;

    if (newPrefix < 0) return;

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
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Kalkulator Pembagian Subnet
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={networkAddress}
            onChange={(e) => {
              setNetworkAddress(e.target.value);
              if (e.target.value === "") setResult(null);
            }}
            placeholder="Network (192.168.1.0)"
            className="bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
          <input
            type="number"
            value={prefixLength}
            onChange={(e) => setPrefixLength(e.target.value)}
            min="0"
            max="30"
            placeholder="Prefix (24)"
            className="bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
          <input
            type="number"
            value={numSubnets}
            onChange={(e) => setNumSubnets(e.target.value)}
            min="1"
            max="256"
            placeholder="Subnet (2)"
            className="bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
        </div>

        <button
          onClick={calculateSubnets}
          className="w-full py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
        >
          Hitung Subnet
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2.5 pt-1"
            >
              <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200 flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-medium">Subnet Mask Baru:</span>
                <span className="font-mono text-xs text-neutral-900 font-bold">{result.subnetMask}</span>
              </div>

              <div>
                <button
                  onClick={() => setShowSubnets(!showSubnets)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors"
                >
                  <span className="text-xs font-semibold text-neutral-800">
                    Daftar {Math.min(10, result.totalSubnets)} dari {result.totalSubnets} Subnet
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showSubnets ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showSubnets && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {result.subnets.map((subnet, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-2.5 border border-neutral-200 text-xs space-y-0.5"
                          >
                            <p className="font-bold text-neutral-900">Subnet {subnet.number}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 font-mono text-[11px] text-neutral-600">
                              <p>Net: <span className="text-neutral-900 font-medium">{subnet.networkAddress}</span></p>
                              <p>Host: <span className="text-neutral-900 font-medium">{subnet.firstHost}–{subnet.lastHost}</span></p>
                              <p>Bcast: <span className="text-neutral-900 font-medium">{subnet.broadcastAddress}</span></p>
                            </div>
                          </div>
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

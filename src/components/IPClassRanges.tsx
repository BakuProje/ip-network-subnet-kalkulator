import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import logo from "@/galery/LOGO KZ.png";

interface ClassInfo {
  class: string;
  range: string;
  defaultMask: string;
  firstOctet: string;
  totalNetworks: string;
  hostsPerNetwork: string;
  examples: string[];
  description: string;
}

const classData: ClassInfo[] = [
  {
    class: "A",
    range: "0.0.0.0 - 127.255.255.255",
    defaultMask: "255.0.0.0",
    firstOctet: "0 - 127",
    totalNetworks: "128 (2⁷)",
    hostsPerNetwork: "16,777,214",
    examples: ["10.0.0.1", "50.100.150.200", "100.200.50.75", "127.0.0.1"],
    description: "Untuk jaringan besar dengan banyak host"
  },
  {
    class: "B",
    range: "128.0.0.0 - 191.255.255.255",
    defaultMask: "255.255.0.0",
    firstOctet: "128 - 191",
    totalNetworks: "16,384 (2¹⁴)",
    hostsPerNetwork: "65,534",
    examples: ["172.16.0.1", "150.100.50.25", "180.200.100.150", "191.255.0.1"],
    description: "Untuk jaringan menengah"
  },
  {
    class: "C",
    range: "192.0.0.0 - 223.255.255.255",
    defaultMask: "255.255.255.0",
    firstOctet: "192 - 223",
    totalNetworks: "2,097,152 (2²¹)",
    hostsPerNetwork: "254",
    examples: ["192.168.1.1", "200.100.50.25", "210.150.75.100", "223.255.255.1"],
    description: "Untuk jaringan kecil"
  }
];

const IPClassRanges = () => {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  const toggleClass = (className: string) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="KZ Logo" 
            className="w-6 h-6 rounded-full object-cover border border-primary/30"
          />
          <div>
            <h3 className="font-bold text-foreground">IP Address Kelas A, B, dan C</h3>
            <p className="text-xs text-muted-foreground mt-0.5"></p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {classData.map((classInfo) => (
          <div key={classInfo.class}>
            <button
              onClick={() => toggleClass(classInfo.class)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">Kelas {classInfo.class}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">
                    {classInfo.firstOctet}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedClass === classInfo.class ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedClass === classInfo.class && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 bg-muted/20 space-y-4">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-card rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Range IP Address</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{classInfo.range}</p>
                      </div>

                      <div className="bg-card rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Oktet Pertama</p>
                        <p className="font-mono text-sm text-primary font-semibold">{classInfo.firstOctet}</p>
                      </div>

                      <div className="bg-card rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Subnet Mask Default</p>
                        <p className="font-mono text-sm text-secondary font-semibold">{classInfo.defaultMask}</p>
                      </div>

                      <div className="bg-card rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Total Network</p>
                        <p className="font-mono text-sm text-accent font-semibold">{classInfo.totalNetworks}</p>
                      </div>

                      <div className="bg-card rounded-lg p-3 border border-border/50 sm:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Host per Network</p>
                        <p className="font-mono text-sm text-foreground font-semibold">{classInfo.hostsPerNetwork}</p>
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="bg-card rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">Contoh IP Address:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {classInfo.examples.map((example, idx) => (
                          <motion.div
                            key={example}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="font-mono text-xs px-2 py-1.5 rounded bg-primary/5 text-primary border border-primary/20"
                          >
                            {example}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IPClassRanges;

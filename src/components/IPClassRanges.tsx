import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers } from "lucide-react";

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
    description: "Jaringan skala besar dengan jutaan host",
  },
  {
    class: "B",
    range: "128.0.0.0 - 191.255.255.255",
    defaultMask: "255.255.0.0",
    firstOctet: "128 - 191",
    totalNetworks: "16,384 (2¹⁴)",
    hostsPerNetwork: "65,534",
    examples: ["172.16.0.1", "150.100.50.25", "180.200.100.150", "191.255.0.1"],
    description: "Jaringan skala menengah",
  },
  {
    class: "C",
    range: "192.0.0.0 - 223.255.255.255",
    defaultMask: "255.255.255.0",
    firstOctet: "192 - 223",
    totalNetworks: "2,097,152 (2²¹)",
    hostsPerNetwork: "254",
    examples: ["192.168.1.1", "200.100.50.25", "210.150.75.100", "223.255.255.1"],
    description: "Jaringan skala kecil (LAN/Rumah)",
  },
];

const IPClassRanges = () => {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  const toggleClass = (className: string) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  return (
    <div className="neo-box bg-white overflow-hidden">
      <div className="p-4 sm:p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-slate-950 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">Rentang IP Address (Kelas A, B, C)</h3>
            <p className="text-xs text-slate-500 font-medium">Karakteristik dan default subnet mask tiap kelas</p>
          </div>
        </div>
      </div>

      <div className="divide-y-2 border-slate-100">
        {classData.map((classInfo) => (
          <div key={classInfo.class}>
            <button
              onClick={() => toggleClass(classInfo.class)}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-slate-900">Kelas {classInfo.class}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-mono font-bold border border-slate-900">
                  Oktet 1: {classInfo.firstOctet}
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-600 font-medium">
                  — {classInfo.description}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-900 transition-transform duration-200 ${
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
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 sm:p-5 bg-slate-50 space-y-3.5 border-t-2 border-slate-900">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                        <p className="text-xs text-slate-500 font-bold mb-0.5">Range IP Address</p>
                        <p className="font-mono text-sm text-slate-900 font-black">{classInfo.range}</p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                        <p className="text-xs text-slate-500 font-bold mb-0.5">Subnet Mask Default</p>
                        <p className="font-mono text-sm text-blue-700 font-black">{classInfo.defaultMask}</p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                        <p className="text-xs text-slate-500 font-bold mb-0.5">Total Network</p>
                        <p className="font-mono text-sm text-purple-700 font-black">{classInfo.totalNetworks}</p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                        <p className="text-xs text-slate-500 font-bold mb-0.5">Host per Network</p>
                        <p className="font-mono text-sm text-emerald-700 font-black">{classInfo.hostsPerNetwork}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-1.5">
                      <p className="text-xs text-slate-700 font-bold">Contoh Alamat IP:</p>
                      <div className="flex flex-wrap gap-2">
                        {classInfo.examples.map((example) => (
                          <span
                            key={example}
                            className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-bold border border-slate-300"
                          >
                            {example}
                          </span>
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

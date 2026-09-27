import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

interface CIDRRow {
  cidr: string;
  subnetMask: string;
  jumlahSubnet: string;
  hostPerSubnet: string;
}

const cidrDataByClass: Record<string, CIDRRow[]> = {
  A: [
    { cidr: "/8", subnetMask: "255.0.0.0", jumlahSubnet: "1", hostPerSubnet: "16,777,214" },
    { cidr: "/9", subnetMask: "255.128.0.0", jumlahSubnet: "2", hostPerSubnet: "8,388,606" },
    { cidr: "/10", subnetMask: "255.192.0.0", jumlahSubnet: "4", hostPerSubnet: "4,194,302" },
    { cidr: "/11", subnetMask: "255.224.0.0", jumlahSubnet: "8", hostPerSubnet: "2,097,150" },
    { cidr: "/12", subnetMask: "255.240.0.0", jumlahSubnet: "16", hostPerSubnet: "1,048,574" },
    { cidr: "/13", subnetMask: "255.248.0.0", jumlahSubnet: "32", hostPerSubnet: "524,286" },
    { cidr: "/14", subnetMask: "255.252.0.0", jumlahSubnet: "64", hostPerSubnet: "262,142" },
    { cidr: "/15", subnetMask: "255.254.0.0", jumlahSubnet: "128", hostPerSubnet: "131,070" },
    { cidr: "/16", subnetMask: "255.255.0.0", jumlahSubnet: "256", hostPerSubnet: "65,534" },
    { cidr: "/17", subnetMask: "255.255.128.0", jumlahSubnet: "512", hostPerSubnet: "32,766" },
    { cidr: "/24", subnetMask: "255.255.255.0", jumlahSubnet: "65,536", hostPerSubnet: "254" },
    { cidr: "/30", subnetMask: "255.255.255.252", jumlahSubnet: "4,194,304", hostPerSubnet: "2" },
  ],
  B: [
    { cidr: "/16", subnetMask: "255.255.0.0", jumlahSubnet: "1", hostPerSubnet: "65,534" },
    { cidr: "/17", subnetMask: "255.255.128.0", jumlahSubnet: "2", hostPerSubnet: "32,766" },
    { cidr: "/18", subnetMask: "255.255.192.0", jumlahSubnet: "4", hostPerSubnet: "16,382" },
    { cidr: "/19", subnetMask: "255.255.224.0", jumlahSubnet: "8", hostPerSubnet: "8,190" },
    { cidr: "/20", subnetMask: "255.255.240.0", jumlahSubnet: "16", hostPerSubnet: "4,094" },
    { cidr: "/21", subnetMask: "255.255.248.0", jumlahSubnet: "32", hostPerSubnet: "2,046" },
    { cidr: "/22", subnetMask: "255.255.252.0", jumlahSubnet: "64", hostPerSubnet: "1,022" },
    { cidr: "/23", subnetMask: "255.255.254.0", jumlahSubnet: "128", hostPerSubnet: "510" },
    { cidr: "/24", subnetMask: "255.255.255.0", jumlahSubnet: "256", hostPerSubnet: "254" },
    { cidr: "/25", subnetMask: "255.255.255.128", jumlahSubnet: "512", hostPerSubnet: "126" },
    { cidr: "/26", subnetMask: "255.255.255.192", jumlahSubnet: "1,024", hostPerSubnet: "62" },
    { cidr: "/27", subnetMask: "255.255.255.224", jumlahSubnet: "2,048", hostPerSubnet: "30" },
    { cidr: "/28", subnetMask: "255.255.255.240", jumlahSubnet: "4,096", hostPerSubnet: "14" },
    { cidr: "/29", subnetMask: "255.255.255.248", jumlahSubnet: "8,192", hostPerSubnet: "6" },
    { cidr: "/30", subnetMask: "255.255.255.252", jumlahSubnet: "16,384", hostPerSubnet: "2" },
  ],
  C: [
    { cidr: "/24", subnetMask: "255.255.255.0", jumlahSubnet: "1", hostPerSubnet: "254" },
    { cidr: "/25", subnetMask: "255.255.255.128", jumlahSubnet: "2", hostPerSubnet: "126" },
    { cidr: "/26", subnetMask: "255.255.255.192", jumlahSubnet: "4", hostPerSubnet: "62" },
    { cidr: "/27", subnetMask: "255.255.255.224", jumlahSubnet: "8", hostPerSubnet: "30" },
    { cidr: "/28", subnetMask: "255.255.255.240", jumlahSubnet: "16", hostPerSubnet: "14" },
    { cidr: "/29", subnetMask: "255.255.255.248", jumlahSubnet: "32", hostPerSubnet: "6" },
    { cidr: "/30", subnetMask: "255.255.255.252", jumlahSubnet: "64", hostPerSubnet: "2" },
  ],
  D: [
    { cidr: "N/A", subnetMask: "N/A", jumlahSubnet: "Multicast", hostPerSubnet: "224.0.0.0 - 239.255.255.255" },
  ],
  E: [
    { cidr: "N/A", subnetMask: "N/A", jumlahSubnet: "Reserved", hostPerSubnet: "240.0.0.0 - 255.255.255.255" },
  ],
};

interface Props {
  ipClass: string;
}

const CIDRReferenceTable = ({ ipClass }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const rows = cidrDataByClass[ipClass] || [];

  return (
    <div className="neo-box bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors border-b-2 border-slate-900 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Tabel Referensi CIDR Kelas {ipClass}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {rows.length} notasi CIDR dan pembagian subnet
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-900 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs font-mono border-2 border-slate-900 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-bold">
                    <th className="px-4 py-2.5 text-left">CIDR</th>
                    <th className="px-4 py-2.5 text-left">Subnet Mask</th>
                    <th className="px-4 py-2.5 text-left">Jumlah Subnet</th>
                    <th className="px-4 py-2.5 text-left">Total Host</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-slate-200">
                  {rows.map((row) => (
                    <tr key={row.cidr} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-blue-700 font-bold">{row.cidr}</td>
                      <td className="px-4 py-2 text-slate-900">{row.subnetMask}</td>
                      <td className="px-4 py-2 text-purple-700 font-bold">{row.jumlahSubnet}</td>
                      <td className="px-4 py-2 text-emerald-700 font-bold">{row.hostPerSubnet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CIDRReferenceTable;

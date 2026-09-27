import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Table2 } from "lucide-react";
import { generateSubnettingTable } from "@/lib/subnet";
import type { IPInfo } from "@/lib/subnet";

interface Props {
  info: IPInfo;
}

const SubnettingTable = ({ info }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (info.ipClass === "D" || info.ipClass === "E") return null;

  const rows = generateSubnettingTable(info, showAll ? 20 : 5);

  return (
    <div className="neo-box bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors border-b-2 border-slate-900 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center text-white shrink-0">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-base text-slate-900 block tracking-tight">Tabel Subnetting Lengkap</span>
            <span className="text-xs text-slate-500 font-medium">Rentang Network ID, Host, dan Broadcast</span>
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
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold">
                    <th className="px-3 py-2.5 text-left">No.</th>
                    <th className="px-3 py-2.5 text-left">Network ID</th>
                    <th className="px-3 py-2.5 text-left">Range IP Host</th>
                    <th className="px-3 py-2.5 text-left">Broadcast</th>
                    <th className="px-3 py-2.5 text-left">Netmask</th>
                    <th className="px-3 py-2.5 text-left">Wildcard</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-slate-200">
                  {rows.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-500 font-bold">{row.no}</td>
                      <td className="px-3 py-2 text-blue-700 font-bold">{row.networkId}</td>
                      <td className="px-3 py-2 text-slate-900 font-semibold">{row.rangeStart} — {row.rangeEnd}</td>
                      <td className="px-3 py-2 text-amber-700 font-bold">{row.broadcast}</td>
                      <td className="px-3 py-2 text-slate-600">{row.netmask}</td>
                      <td className="px-3 py-2 text-slate-600">{row.wildcard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t-2 border-slate-100 flex justify-center bg-slate-50">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold neo-btn-sm"
              >
                {showAll ? "Tampilkan Lebih Sedikit" : "Tampilkan Lebih Banyak (20 Subnet)"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubnettingTable;

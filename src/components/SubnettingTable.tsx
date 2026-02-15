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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Table2 className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">Tabel Subnetting Lengkap</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-t border-border bg-muted/30">
                    <th className="px-3 py-2.5 text-left text-muted-foreground font-medium">No.</th>
                    <th className="px-3 py-2.5 text-left text-muted-foreground font-medium">Network ID</th>
                    <th className="px-3 py-2.5 text-left text-muted-foreground font-medium">Range IP Host</th>
                    <th className="px-3 py-2.5 text-left text-muted-foreground font-medium">Broadcast</th>
                    <th className="px-3 py-2.5 text-left text-muted-foreground font-medium">Netmask</th>
                    <th className="px-3 py-2.5 text-left text-muted-foreground font-medium">Wildcard</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.no} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2 text-accent">{row.no}</td>
                      <td className="px-3 py-2 text-primary">{row.networkId}</td>
                      <td className="px-3 py-2 text-foreground">{row.rangeStart} — {row.rangeEnd}</td>
                      <td className="px-3 py-2 text-foreground">{row.broadcast}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.netmask}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.wildcard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border/50 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {showAll ? "Tampilkan lebih sedikit" : "Tampilkan lebih banyak"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubnettingTable;

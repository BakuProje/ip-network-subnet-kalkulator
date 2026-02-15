import { motion } from "framer-motion";
import type { IPInfo } from "@/lib/subnet";

interface Props {
  info: IPInfo;
}

const BinaryVisual = ({ info }: Props) => {
  const networkBits = info.cidr;

  const renderBits = (binaryOctets: string[], label: string) => {
    let bitIndex = 0;
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
        <div className="flex flex-wrap gap-1.5">
          {binaryOctets.map((octet, oi) => (
            <div key={oi} className="flex items-center gap-px">
              {octet.split("").map((bit, bi) => {
                const currentBitIndex = bitIndex++;
                const isNetwork = currentBitIndex < networkBits;
                return (
                  <motion.span
                    key={bi}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: currentBitIndex * 0.01 }}
                    className={`inline-flex items-center justify-center w-5 h-6 text-xs font-mono font-bold rounded-sm ${
                      isNetwork
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-secondary/20 text-secondary border border-secondary/30"
                    }`}
                  >
                    {bit}
                  </motion.span>
                );
              })}
              {oi < 3 && (
                <span className="text-muted-foreground font-mono text-xs mx-0.5">.</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        Representasi Biner
      </h3>

      {renderBits(info.ipBinary, "Alamat IP")}
      {renderBits(info.netmaskBinary, "Netmask")}

      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/40" />
          <span className="text-xs text-muted-foreground">Network ({info.cidr} bit)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-secondary/30 border border-secondary/40" />
          <span className="text-xs text-muted-foreground">Host ({32 - info.cidr} bit)</span>
        </div>
      </div>
    </div>
  );
};

export default BinaryVisual;
